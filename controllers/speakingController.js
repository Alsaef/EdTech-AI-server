const SpeakingQuestion = require('../models/SpeakingQuestion');

// Get all speaking questions with filters
async function getSpeakingQuestions(req, res, next) {
  try {
    const { category, difficulty, page = 1, limit = 10 } = req.query;
    const query = {};

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const questions = await SpeakingQuestion.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await SpeakingQuestion.countDocuments(query);

    res.json({
      questions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
}

// Get random speaking question for practice
async function getRandomQuestion(req, res, next) {
  try {
    const { category, difficulty } = req.query;
    const query = {};

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const questions = await SpeakingQuestion.aggregate([
      { $match: query },
      { $sample: { size: 1 } }
    ]);

    if (questions.length === 0) {
      return res.status(404).json({ error: 'No questions found matching criteria' });
    }

    res.json(questions[0]);
  } catch (err) {
    next(err);
  }
}

// Create speaking question (admin only)
async function createSpeakingQuestion(req, res, next) {
  try {
    const question = await SpeakingQuestion.create(req.body);
    res.status(201).json(question);
  } catch (err) {
    next(err);
  }
}

// Update speaking question (admin only)
async function updateSpeakingQuestion(req, res, next) {
  try {
    const question = await SpeakingQuestion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json(question);
  } catch (err) {
    next(err);
  }
}

// Delete speaking question (admin only)
async function deleteSpeakingQuestion(req, res, next) {
  try {
    const question = await SpeakingQuestion.findByIdAndDelete(req.params.id);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json({ message: 'Question deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSpeakingQuestions,
  getRandomQuestion,
  createSpeakingQuestion,
  updateSpeakingQuestion,
  deleteSpeakingQuestion
};