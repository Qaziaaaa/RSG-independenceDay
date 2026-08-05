const express = require('express');
const projectController = require('../controllers/projectController');
const { protect } = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const {
  createProjectValidator,
  updateProjectStatusValidator,
} = require('../validators/projectValidator');

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'super-admin'));

router.post('/', createProjectValidator, validate, projectController.assignProject);
router.patch('/:id/status', updateProjectStatusValidator, validate, projectController.updateProjectStatus);

module.exports = router;
