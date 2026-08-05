const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/apiResponse');
const dashboardService = require('../services/dashboardService');

exports.getDashboard = catchAsync(async (req, res) => {
  const data = await dashboardService.getDashboard();
  return ApiResponse.success(res, 'Dashboard data fetched successfully', data);
});
