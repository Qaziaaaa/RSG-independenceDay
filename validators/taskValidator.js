const { body } = require('express-validator');
const { TASK_STATUSES } = require('../models/taskModel');

const createTaskValidator = [
  body('studentId')
    .isMongoId()
    .withMessage('Valid student ID is required'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ max: 150 })
    .withMessage('Title cannot exceed 150 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('dueDate')
    .isISO8601()
    .withMessage('Valid due date is required'),
  body('status')
    .optional()
    .isIn(TASK_STATUSES)
    .withMessage(`Status must be one of: ${TASK_STATUSES.join(', ')}`),
];

const updateTaskValidator = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 150 })
    .withMessage('Title cannot exceed 150 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Valid due date is required'),
  body('status')
    .optional()
    .isIn(TASK_STATUSES)
    .withMessage(`Status must be one of: ${TASK_STATUSES.join(', ')}`),
];

const updateTaskStatusValidator = [
  body('status')
    .isIn(TASK_STATUSES)
    .withMessage(`Status must be one of: ${TASK_STATUSES.join(', ')}`),
];

module.exports = { createTaskValidator, updateTaskValidator, updateTaskStatusValidator };
