const express = require('express');
const taskController = require('../controllers/taskController');
const { protect } = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const {
  createTaskValidator,
  updateTaskValidator,
  updateTaskStatusValidator,
} = require('../validators/taskValidator');

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'super-admin'));

router.get('/', taskController.getTasks);
router.get('/history/:studentId', taskController.getTaskHistory);
router.post('/', createTaskValidator, validate, taskController.createTask);
router.put('/:id', updateTaskValidator, validate, taskController.updateTask);
router.patch('/:id/status', updateTaskStatusValidator, validate, taskController.changeTaskStatus);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
