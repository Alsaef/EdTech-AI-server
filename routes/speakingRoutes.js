const express = require('express');
const router = express.Router();
const speakingController = require('../controllers/speakingController');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');

// Public routes
router.get('/', speakingController.getSpeakingQuestions);
router.get('/random', speakingController.getRandomQuestion);

// Admin only routes
router.post('/', auth.required, roles.requireRole('admin'), speakingController.createSpeakingQuestion);
router.put('/:id', auth.required, roles.requireRole('admin'), speakingController.updateSpeakingQuestion);
router.delete('/:id', auth.required, roles.requireRole('admin'), speakingController.deleteSpeakingQuestion);

module.exports = router;