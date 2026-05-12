const VocabularySuggestion = require('../models/VocabularySuggestion');

// Get vocabulary suggestions with filters
async function getVocabulary(req, res, next) {
  try {
    const { category, difficulty, page = 1, limit = 20 } = req.query;
    const query = {};

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const vocabulary = await VocabularySuggestion.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await VocabularySuggestion.countDocuments(query);

    res.json({
      vocabulary,
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

// Get random vocabulary suggestions
async function getRandomVocabulary(req, res, next) {
  try {
    const { count = 5, category, difficulty } = req.query;
    const query = {};

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const vocabulary = await VocabularySuggestion.aggregate([
      { $match: query },
      { $sample: { size: parseInt(count) } }
    ]);

    res.json(vocabulary);
  } catch (err) {
    next(err);
  }
}

// Search vocabulary by word
async function searchVocabulary(req, res, next) {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const vocabulary = await VocabularySuggestion.find({
      $or: [
        { word: { $regex: q, $options: 'i' } },
        { definition: { $regex: q, $options: 'i' } },
        { synonyms: { $in: [new RegExp(q, 'i')] } }
      ]
    }).limit(20);

    res.json(vocabulary);
  } catch (err) {
    next(err);
  }
}

// Create vocabulary suggestion (admin only)
async function createVocabulary(req, res, next) {
  try {
    const vocabulary = await VocabularySuggestion.create(req.body);
    res.status(201).json(vocabulary);
  } catch (err) {
    next(err);
  }
}

// Update vocabulary (admin only)
async function updateVocabulary(req, res, next) {
  try {
    const vocabulary = await VocabularySuggestion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!vocabulary) {
      return res.status(404).json({ error: 'Vocabulary not found' });
    }

    res.json(vocabulary);
  } catch (err) {
    next(err);
  }
}

// Delete vocabulary (admin only)
async function deleteVocabulary(req, res, next) {
  try {
    const vocabulary = await VocabularySuggestion.findByIdAndDelete(req.params.id);

    if (!vocabulary) {
      return res.status(404).json({ error: 'Vocabulary not found' });
    }

    res.json({ message: 'Vocabulary deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getVocabulary,
  getRandomVocabulary,
  searchVocabulary,
  createVocabulary,
  updateVocabulary,
  deleteVocabulary
};