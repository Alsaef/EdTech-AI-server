const express = require('express');
const router = express.Router();
const bandScoreController = require('../controllers/bandScoreController');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');

// Public routes
router.get('/', bandScoreController.getBandScoreTips);
router.get('/personalized', auth.required, bandScoreController.getPersonalizedTips);

// Admin only routes
router.post('/', auth.required, roles.requireRole('admin'), bandScoreController.createBandScoreTip);
router.put('/:id', auth.required, roles.requireRole('admin'), bandScoreController.updateBandScoreTip);
router.delete('/:id', auth.required, roles.requireRole('admin'), bandScoreController.deleteBandScoreTip);

module.exports = router;