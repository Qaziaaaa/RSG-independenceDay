const { body } = require('express-validator');

const createTeamValidator = [
  body('teamName')
    .trim()
    .notEmpty()
    .withMessage('Team name is required')
    .isLength({ max: 100 })
    .withMessage('Team name cannot exceed 100 characters'),
  body('members')
    .optional()
    .isArray()
    .withMessage('Members must be an array of student IDs'),
  body('members.*')
    .optional()
    .isMongoId()
    .withMessage('Each member must be a valid student ID'),
];

const updateTeamValidator = [
  body('teamName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Team name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Team name cannot exceed 100 characters'),
  body('members')
    .optional()
    .isArray()
    .withMessage('Members must be an array of student IDs'),
  body('members.*')
    .optional()
    .isMongoId()
    .withMessage('Each member must be a valid student ID'),
];

module.exports = { createTeamValidator, updateTeamValidator };
