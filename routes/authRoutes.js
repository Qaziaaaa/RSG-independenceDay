const express = require('express');
const authController = require('../controllers/authController');
const { loginValidator } = require('../validators/authValidator');
const validate = require('../middlewares/validate');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/login', loginValidator, validate, authController.login);
router.get('/me', protect, authController.getMe);

module.exports = router;
