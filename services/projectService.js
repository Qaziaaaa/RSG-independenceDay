const Project = require('../models/projectModel');
const Team = require('../models/teamModel');
const ApiError = require('../utils/apiError');

exports.assignProject = async (payload) => {
  const team = await Team.findById(payload.teamId);
  if (!team) {
    throw new ApiError('Team not found', 404);
  }

  const activeProject = await Project.findOne({ team: payload.teamId, isActive: true });
  if (activeProject) {
    throw new ApiError(
      'One team can have only one active project',
      400,
      [`Team already has an active project: ${activeProject.projectName}`]
    );
  }

  const project = await Project.create({
    team: payload.teamId,
    projectName: payload.projectName,
    description: payload.description,
    deadline: payload.deadline,
    status: payload.status || 'Not Started',
  });

  await Team.findByIdAndUpdate(payload.teamId, { $set: { project: project._id } });

  return Project.findById(project._id).populate('team', 'teamName');
};

exports.updateProjectStatus = async (id, status) => {
  const project = await Project.findById(id);
  if (!project) {
    throw new ApiError('Project not found', 404);
  }

  project.status = status;
  if (status === 'Completed') {
    project.isActive = false;
  }
  await project.save();

  return Project.findById(project._id).populate('team', 'teamName');
};
