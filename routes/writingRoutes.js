const express = require('express');
const router = express.Router();
const writingController = require('../controllers/writingController');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');

// User routes (require auth)
router.post('/submit', auth.required, writingController.submitWriting);
router.get('/my-submissions', auth.required, writingController.getUserSubmissions);
router.get('/:id', auth.required, writingController.getSubmission);

// Admin routes
router.get('/', auth.required, roles.requireRole('admin'), writingController.getAllSubmissions);

module.exports = router;