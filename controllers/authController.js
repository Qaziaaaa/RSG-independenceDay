const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/apiResponse');
const authService = require('../services/authService');

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  return ApiResponse.success(res, 'Login successful', result, 200);
});

exports.getMe = catchAsync(async (req, res) => {
  const admin = await authService.getProfile(req.admin._id);
  return ApiResponse.success(res, 'Admin profile fetched successfully', { admin }, 200);
});
