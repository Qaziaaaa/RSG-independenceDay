const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/apiResponse');
const taskService = require('../services/taskService');

exports.getTasks = catchAsync(async (req, res) => {
  const data = await taskService.listTasks(req.query);
  return ApiResponse.success(res, 'Tasks fetched successfully', data);
});

exports.getTaskHistory = catchAsync(async (req, res) => {
  const data = await taskService.getTaskHistory(req.params.studentId);
  return ApiResponse.success(res, 'Task history fetched successfully', data);
});

exports.createTask = catchAsync(async (req, res) => {
  const task = await taskService.createTask(req.body);
  return ApiResponse.success(res, 'Task created successfully', { task }, 201);
});

exports.updateTask = catchAsync(async (req, res) => {
  const task = await taskService.updateTask(req.params.id, req.body);
  return ApiResponse.success(res, 'Task updated successfully', { task });
});

exports.deleteTask = catchAsync(async (req, res) => {
  const data = await taskService.deleteTask(req.params.id);
  return ApiResponse.success(res, 'Task deleted successfully', data);
});

exports.changeTaskStatus = catchAsync(async (req, res) => {
  const task = await taskService.changeTaskStatus(req.params.id, req.body.status);
  return ApiResponse.success(res, 'Task status updated successfully', { task });
});
