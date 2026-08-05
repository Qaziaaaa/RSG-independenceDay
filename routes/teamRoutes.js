const express = require('express');
const teamController = require('../controllers/teamController');
const { protect } = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const { createTeamValidator, updateTeamValidator } = require('../validators/teamValidator');

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'super-admin'));

router.get('/', teamController.getTeams);
router.post('/', createTeamValidator, validate, teamController.createTeam);
router.get('/:id', teamController.getTeamById);
router.put('/:id', updateTeamValidator, validate, teamController.updateTeam);
router.delete('/:id', teamController.deleteTeam);

module.exports = router;
