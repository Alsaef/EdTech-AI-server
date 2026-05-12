const express = require('express');
const router = express.Router();
const vocabularyController = require('../controllers/vocabularyController');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');

// Public routes
router.get('/', vocabularyController.getVocabulary);
router.get('/random', vocabularyController.getRandomVocabulary);
router.get('/search', vocabularyController.searchVocabulary);

// Admin only routes
router.post('/', auth.required, roles.requireRole('admin'), vocabularyController.createVocabulary);
router.put('/:id', auth.required, roles.requireRole('admin'), vocabularyController.updateVocabulary);
router.delete('/:id', auth.required, roles.requireRole('admin'), vocabularyController.deleteVocabulary);

module.exports = router;