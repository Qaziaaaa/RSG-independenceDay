const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'super-admin'));

router.get('/', dashboardController.getDashboard);

module.exports = router;
