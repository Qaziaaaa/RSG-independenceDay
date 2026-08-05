const express = require('express');

const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/teams', require('./teamRoutes'));
router.use('/projects', require('./projectRoutes'));
router.use('/tasks', require('./taskRoutes'));
router.use('/attendance', require('./attendanceRoutes'));
router.use('/dashboard', require('./dashboardRoutes'));

module.exports = router;
