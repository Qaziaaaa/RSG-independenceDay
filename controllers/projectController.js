const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/apiResponse');
const projectService = require('../services/projectService');

exports.assignProject = catchAsync(async (req, res) => {
  const project = await projectService.assignProject(req.body);
  return ApiResponse.success(res, 'Project assigned successfully', { project }, 201);
});

exports.updateProjectStatus = catchAsync(async (req, res) => {
  const project = await projectService.updateProjectStatus(req.params.id, req.body.status);
  return ApiResponse.success(res, 'Project status updated successfully', { project });
});
