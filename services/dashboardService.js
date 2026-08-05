const Student = require('../models/studentModel');
const Team = require('../models/teamModel');
const Project = require('../models/projectModel');
const Task = require('../models/taskModel');
const Attendance = require('../models/attendanceModel');

exports.getDashboard = async () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const [totalStudents, presentToday, absentToday, totalTeams, pendingTasks, activeProjects] =
    await Promise.all([
      Student.countDocuments(),
      Attendance.countDocuments({ date: { $gte: start, $lt: end }, status: 'Present' }),
      Attendance.countDocuments({ date: { $gte: start, $lt: end }, status: 'Absent' }),
      Team.countDocuments(),
      Task.countDocuments({ status: 'Pending' }),
      Project.countDocuments({ status: { $ne: 'Completed' }, isActive: true }),
    ]);

  return {
    totalStudents,
    presentToday,
    absentToday,
    totalTeams,
    pendingTasks,
    activeProjects,
  };
};
