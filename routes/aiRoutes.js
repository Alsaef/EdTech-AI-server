const express = require('express');
const router = express.Router();
const { generateText } = require('../controllers/aiController');
const auth = require('../middleware/auth');

router.post('/generate', auth.optional, generateText);

module.exports = router;
