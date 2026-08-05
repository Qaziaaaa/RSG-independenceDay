const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/apiResponse');
const teamService = require('../services/teamService');

exports.getTeams = catchAsync(async (req, res) => {
  const data = await teamService.listTeams(req.query);
  return ApiResponse.success(res, 'Teams fetched successfully', data);
});

exports.createTeam = catchAsync(async (req, res) => {
  const team = await teamService.createTeam(req.body);
  return ApiResponse.success(res, 'Team created successfully', { team }, 201);
});

exports.getTeamById = catchAsync(async (req, res) => {
  const data = await teamService.getTeamById(req.params.id);
  return ApiResponse.success(res, 'Team details fetched successfully', data);
});

exports.updateTeam = catchAsync(async (req, res) => {
  const team = await teamService.updateTeam(req.params.id, req.body);
  return ApiResponse.success(res, 'Team updated successfully', { team });
});

exports.deleteTeam = catchAsync(async (req, res) => {
  const data = await teamService.deleteTeam(req.params.id);
  return ApiResponse.success(res, 'Team deleted successfully', data, 200);
});
