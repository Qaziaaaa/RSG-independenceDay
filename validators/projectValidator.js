const { body } = require('express-validator');
const { PROJECT_STATUSES } = require('../models/projectModel');

const createProjectValidator = [
  body('teamId')
    .isMongoId()
    .withMessage('Valid team ID is required'),
  body('projectName')
    .trim()
    .notEmpty()
    .withMessage('Project name is required')
    .isLength({ max: 150 })
    .withMessage('Project name cannot exceed 150 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('deadline')
    .isISO8601()
    .withMessage('Valid deadline date is required'),
  body('status')
    .optional()
    .isIn(PROJECT_STATUSES)
    .withMessage(`Status must be one of: ${PROJECT_STATUSES.join(', ')}`),
];

const updateProjectStatusValidator = [
  body('status')
    .isIn(PROJECT_STATUSES)
    .withMessage(`Status must be one of: ${PROJECT_STATUSES.join(', ')}`),
];

module.exports = { createProjectValidator, updateProjectStatusValidator };
