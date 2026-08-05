const { body } = require('express-validator');
const { ATTENDANCE_STATUSES } = require('../models/attendanceModel');

const markAttendanceValidator = [
  body('studentId')
    .isMongoId()
    .withMessage('Valid student ID is required'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Valid date is required'),
  body('status')
    .optional()
    .isIn(ATTENDANCE_STATUSES)
    .withMessage(`Status must be one of: ${ATTENDANCE_STATUSES.join(', ')}`),
];

module.exports = { markAttendanceValidator };
