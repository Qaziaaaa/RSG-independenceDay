const Team = require('../models/teamModel');
const Student = require('../models/studentModel');
const Project = require('../models/projectModel');
const ApiError = require('../utils/apiError');
const { paginate, buildPaginationMeta } = require('../utils/pagination');

const MEMBER_FIELDS = 'name email regNo phone status';

const validateMembersExist = async (memberIds) => {
  if (!memberIds || memberIds.length === 0) return;
  const count = await Student.countDocuments({ _id: { $in: memberIds } });
  if (count !== memberIds.length) {
    throw new ApiError('One or more students not found', 400, ['Please provide valid student IDs']);
  }
};

const assertStudentsAvailable = async (memberIds, excludeTeamId = null) => {
  if (!memberIds || memberIds.length === 0) return;
  const occupiedTeams = await Team.find({
    _id: { $ne: excludeTeamId },
    members: { $in: memberIds },
  }).select('teamName members');

  if (occupiedTeams.length > 0) {
    const occupiedIds = new Set();
    occupiedTeams.forEach((team) => {
      team.members.forEach((memberId) => {
        if (memberIds.map(String).includes(String(memberId))) {
          occupiedIds.add(String(memberId));
        }
      });
    });
    throw new ApiError(
      'One or more students already belong to another team',
      400,
      [`Student(s) [${[...occupiedIds].join(', ')}] are already assigned to a team`]
    );
  }
};

exports.listTeams = async (query) => {
  const { pageNum, limitNum, skip } = paginate(query.page, query.limit);

  const filter = {};
  if (query.search) {
    filter.teamName = { $regex: query.search, $options: 'i' };
  }

  const [items, total] = await Promise.all([
    Team.find(filter)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 })
      .populate('members', MEMBER_FIELDS)
      .populate('project', 'projectName status deadline'),
    Team.countDocuments(filter),
  ]);

  return { items, pagination: buildPaginationMeta(total, pageNum, limitNum) };
};

exports.createTeam = async (payload) => {
  const existing = await Team.findOne({ teamName: payload.teamName });
  if (existing) {
    throw new ApiError('Team name must be unique', 400, ['Team name already exists']);
  }

  const memberIds = payload.members || [];
  await validateMembersExist(memberIds);
  await assertStudentsAvailable(memberIds);

  const team = await Team.create({
    teamName: payload.teamName,
    members: memberIds,
  });

  if (memberIds.length > 0) {
    await Student.updateMany({ _id: { $in: memberIds } }, { $set: { team: team._id } });
  }

  return Team.findById(team._id)
    .populate('members', MEMBER_FIELDS)
    .populate('project', 'projectName status deadline');
};

exports.getTeamById = async (id) => {
  const team = await Team.findById(id)
    .populate('members', MEMBER_FIELDS)
    .populate('project', 'projectName description deadline status');
  if (!team) {
    throw new ApiError('Team not found', 404);
  }

  return {
    teamName: team.teamName,
    totalMembers: team.members.length,
    members: team.members,
    project: team.project
      ? {
          projectName: team.project.projectName,
          description: team.project.description,
          deadline: team.project.deadline,
          status: team.project.status,
        }
      : null,
    projectStatus: team.project ? team.project.status : 'No project assigned',
  };
};

exports.updateTeam = async (id, payload) => {
  const team = await Team.findById(id);
  if (!team) {
    throw new ApiError('Team not found', 404);
  }

  if (payload.teamName !== undefined) {
    const existing = await Team.findOne({ teamName: payload.teamName, _id: { $ne: id } });
    if (existing) {
      throw new ApiError('Team name must be unique', 400, ['Team name already exists']);
    }
    team.teamName = payload.teamName;
  }

  if (payload.members !== undefined) {
    await validateMembersExist(payload.members);
    await assertStudentsAvailable(payload.members, id);

    const oldMemberIds = team.members.map(String);
    const newMemberIds = payload.members.map(String);

    const removed = oldMemberIds.filter((m) => !newMemberIds.includes(m));
    const added = newMemberIds.filter((m) => !oldMemberIds.includes(m));

    if (removed.length > 0) {
      await Student.updateMany({ _id: { $in: removed } }, { $set: { team: null } });
    }
    if (added.length > 0) {
      await Student.updateMany({ _id: { $in: added } }, { $set: { team: id } });
    }

    team.members = payload.members;
  }

  await team.save();

  return Team.findById(team._id)
    .populate('members', MEMBER_FIELDS)
    .populate('project', 'projectName status deadline');
};

exports.deleteTeam = async (id) => {
  const team = await Team.findById(id);
  if (!team) {
    throw new ApiError('Team not found', 404);
  }

  if (team.members.length > 0) {
    await Student.updateMany({ _id: { $in: team.members } }, { $set: { team: null } });
  }
  await Project.updateMany({ team: id, isActive: true }, { $set: { isActive: false } });

  await team.deleteOne();
  return { id, teamName: team.teamName };
};
