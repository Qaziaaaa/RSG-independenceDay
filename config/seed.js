const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./db');
const { MONGO_URI } = require('./index');
const Admin = require('../models/adminModel');
const Student = require('../models/studentModel');
const Team = require('../models/teamModel');
const Project = require('../models/projectModel');
const Task = require('../models/taskModel');
const Attendance = require('../models/attendanceModel');

const seed = async () => {
  await connectDB();

  await Promise.all([
    Admin.deleteMany({}),
    Student.deleteMany({}),
    Team.deleteMany({}),
    Project.deleteMany({}),
    Task.deleteMany({}),
    Attendance.deleteMany({}),
  ]);

  const passwordHash = await bcrypt.hash('admin123', 10);
  const admin = await Admin.create({
    name: 'Super Admin',
    email: 'admin@bootcamp.com',
    password: passwordHash,
    role: 'super-admin',
  });

  const students = await Student.create([
    { name: 'Ali Khan', email: 'ali@bootcamp.com', regNo: 'BC-001', phone: '0300-0000001' },
    { name: 'Sara Ahmed', email: 'sara@bootcamp.com', regNo: 'BC-002', phone: '0300-0000002' },
    { name: 'Bilal Hussain', email: 'bilal@bootcamp.com', regNo: 'BC-003', phone: '0300-0000003' },
    { name: 'Ayesha Malik', email: 'ayesha@bootcamp.com', regNo: 'BC-004', phone: '0300-0000004' },
    { name: 'Usman Tariq', email: 'usman@bootcamp.com', regNo: 'BC-005', phone: '0300-0000005' },
    { name: 'Fatima Noor', email: 'fatima@bootcamp.com', regNo: 'BC-006', phone: '0300-0000006' },
  ]);

  const teamA = await Team.create({ teamName: 'Team Alpha', members: [students[0]._id, students[1]._id] });
  const teamB = await Team.create({ teamName: 'Team Beta', members: [students[2]._id, students[3]._id] });

  await Student.updateMany(
    { _id: { $in: [students[0]._id, students[1]._id] } },
    { $set: { team: teamA._id } }
  );
  await Student.updateMany(
    { _id: { $in: [students[2]._id, students[3]._id] } },
    { $set: { team: teamB._id } }
  );

  const projectA = await Project.create({
    team: teamA._id,
    projectName: 'E-Commerce Platform',
    description: 'Full stack e-commerce application with admin panel',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'In Progress',
  });

  await Project.create({
    team: teamB._id,
    projectName: 'Bootcamp LMS',
    description: 'Learning management system for the bootcamp',
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    status: 'Not Started',
  });

  await Team.updateMany({ _id: teamA._id }, { $set: { project: projectA._id } });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await Task.create([
    { student: students[0]._id, title: 'Design landing page', description: 'Create responsive landing page mockup', dueDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), status: 'In Progress' },
    { student: students[1]._id, title: 'Set up database schema', description: 'Define MongoDB collections and relationships', dueDate: today, status: 'Pending' },
    { student: students[2]._id, title: 'Build auth module', description: 'JWT based admin authentication', dueDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000), status: 'Completed' },
    { student: students[3]._id, title: 'Write API documentation', description: 'Document all endpoints with examples', dueDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000), status: 'Pending' },
  ]);

  await Attendance.create([
    { student: students[0]._id, date: today, status: 'Present' },
    { student: students[1]._id, date: today, status: 'Present' },
    { student: students[2]._id, date: today, status: 'Absent' },
    { student: students[3]._id, date: today, status: 'Present' },
    { student: students[4]._id, date: today, status: 'Late' },
    { student: students[5]._id, date: today, status: 'Present' },
  ]);

  console.log('Seed completed successfully!');
  console.log(`Admin login -> email: ${admin.email} | password: admin123`);
  console.log('MongoDB:', MONGO_URI);
  mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
