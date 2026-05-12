const gemini = require('../utils/gemini');
const Message = require('../models/Message');

async function generateText(req, res, next) {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Missing prompt' });
    const response = await gemini.generateText(prompt);
    // save user message + assistant reply
    if (req.user) {
      await Message.create({ user: req.user.id, role: 'user', text: prompt });
      await Message.create({ user: req.user.id, role: 'assistant', text: response });
    }
    res.json({ output: response });
  } catch (err) {
    next(err);
  }
}

module.exports = { generateText };
