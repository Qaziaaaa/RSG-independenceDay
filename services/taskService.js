const mongoose = require('mongoose');
const Task = require('../models/taskModel');
const Student = require('../models/studentModel');
const ApiError = require('../utils/apiError');
const { paginate, buildPaginationMeta } = require('../utils/pagination');

const TASK_FIELDS = 'name email regNo phone status';
const VALID_STATUSES = ['Pending', 'In Progress', 'Completed'];

const startOfToday = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return start;
};

const endOfToday = () => {
  const end = startOfToday();
  end.setDate(end.getDate() + 1);
  return end;
};

exports.createTask = async (payload) => {
  const student = await Student.findById(payload.studentId);
  if (!student) {
    throw new ApiError('Student not found', 404);
  }

  const task = await Task.create({
    student: payload.studentId,
    title: payload.title,
    description: payload.description,
    dueDate: payload.dueDate,
    status: payload.status || 'Pending',
  });

  return Task.findById(task._id).populate('student', TASK_FIELDS);
};

exports.updateTask = async (id, payload) => {
  const task = await Task.findById(id);
  if (!task) {
    throw new ApiError('Task not found', 404);
  }

  if (payload.title !== undefined) task.title = payload.title;
  if (payload.description !== undefined) task.description = payload.description;
  if (payload.dueDate !== undefined) task.dueDate = payload.dueDate;
  if (payload.status !== undefined) task.status = payload.status;

  await task.save();
  return Task.findById(task._id).populate('student', TASK_FIELDS);
};

exports.deleteTask = async (id) => {
  const task = await Task.findById(id);
  if (!task) {
    throw new ApiError('Task not found', 404);
  }
  await task.deleteOne();
  return { id };
};

exports.changeTaskStatus = async (id, status) => {
  const task = await Task.findById(id);
  if (!task) {
    throw new ApiError('Task not found', 404);
  }
  task.status = status;
  await task.save();
  return Task.findById(task._id).populate('student', TASK_FIELDS);
};

exports.getTaskHistory = async (studentId) => {
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new ApiError('Invalid student ID', 400);
  }
  const student = await Student.findById(studentId);
  if (!student) {
    throw new ApiError('Student not found', 404);
  }

  const startDay = startOfToday();
  const endDay = endOfToday();
  const startWeek = new Date(startDay);
  startWeek.setDate(startWeek.getDate() - 6);
  const startMonth = new Date(startDay);
  startMonth.setDate(startMonth.getDate() - 29);

  const [dailyTasks, weeklyTasks, monthlyTasks, allTasks] = await Promise.all([
    Task.find({ student: studentId, dueDate: { $gte: startDay, $lt: endDay } })
      .sort({ dueDate: 1 })
      .populate('student', TASK_FIELDS),
    Task.find({ student: studentId, dueDate: { $gte: startWeek, $lt: endDay } })
      .sort({ dueDate: 1 })
      .populate('student', TASK_FIELDS),
    Task.find({ student: studentId, dueDate: { $gte: startMonth, $lt: endDay } })
      .sort({ dueDate: 1 })
      .populate('student', TASK_FIELDS),
    Task.find({ student: studentId }),
  ]);

  return {
    dailyTasks,
    weeklyTasks,
    monthlyTasks,
    summary: {
      totalTasks: allTasks.length,
      completed: allTasks.filter((t) => t.status === 'Completed').length,
      pending: allTasks.filter((t) => t.status === 'Pending').length,
      inProgress: allTasks.filter((t) => t.status === 'In Progress').length,
    },
  };
};

exports.listTasks = async (query) => {
  const { pageNum, limitNum, skip } = paginate(query.page, query.limit);

  const filter = {};
  if (query.studentId) {
    if (!mongoose.Types.ObjectId.isValid(query.studentId)) {
      throw new ApiError('Invalid student ID', 400);
    }
    filter.student = query.studentId;
  }
  if (query.status) {
    if (!VALID_STATUSES.includes(query.status)) {
      throw new ApiError(`Status must be one of: ${VALID_STATUSES.join(', ')}`, 400);
    }
    filter.status = query.status;
  }
  if (query.date) {
    const date = new Date(query.date);
    if (Number.isNaN(date.getTime())) {
      throw new ApiError('Invalid date, use YYYY-MM-DD format', 400);
    }
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    filter.dueDate = { $gte: start, $lt: end };
  }
  if (query.search) {
    filter.title = { $regex: query.search, $options: 'i' };
  }

  const [items, total] = await Promise.all([
    Task.find(filter)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 })
      .populate('student', TASK_FIELDS),
    Task.countDocuments(filter),
  ]);

  return { items, pagination: buildPaginationMeta(total, pageNum, limitNum) };
};
