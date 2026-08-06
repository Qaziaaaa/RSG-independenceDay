const express = require('express');
const attendanceController = require('../controllers/attendanceController');
const { protect } = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const { markAttendanceValidator } = require('../validators/attendanceValidator');

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'super-admin'));

router.post('/', markAttendanceValidator, validate, attendanceController.markAttendance);
router.get('/', attendanceController.getAttendance);
router.get('/student/:studentId', attendanceController.getStudentAttendance);

module.exports = router;
