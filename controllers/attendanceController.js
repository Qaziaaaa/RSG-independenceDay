const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/apiResponse');
const attendanceService = require('../services/attendanceService');

exports.markAttendance = catchAsync(async (req, res) => {
  const attendance = await attendanceService.markAttendance(req.body);
  return ApiResponse.success(res, 'Attendance marked successfully', { attendance }, 201);
});

exports.getAttendance = catchAsync(async (req, res) => {
  const data = await attendanceService.listAttendance(req.query);
  return ApiResponse.success(res, 'Attendance records fetched successfully', data);
});

exports.getStudentAttendance = catchAsync(async (req, res) => {
  const data = await attendanceService.getStudentAttendance(req.params.studentId);
  return ApiResponse.success(res, 'Student attendance fetched successfully', data);
});
