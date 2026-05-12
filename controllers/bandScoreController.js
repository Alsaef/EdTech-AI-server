const BandScoreTip = require('../models/BandScoreTip');

// Get band score tips with filters
async function getBandScoreTips(req, res, next) {
  try {
    const { targetBand, skill, category, page = 1, limit = 10 } = req.query;
    const query = {};

    if (targetBand) query.targetBand = parseInt(targetBand);
    if (skill) query.skill = skill;
    if (category) query.category = category;

    const tips = await BandScoreTip.find(query)
      .sort({ targetBand: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await BandScoreTip.countDocuments(query);

    res.json({
      tips,
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

// Get personalized tips based on user's current level
async function getPersonalizedTips(req, res, next) {
  try {
    const { currentBand, targetBand, skill } = req.query;
    const query = {};

    if (targetBand) {
      query.targetBand = { $gte: parseInt(currentBand || 0), $lte: parseInt(targetBand) };
    } else if (currentBand) {
      query.targetBand = { $gt: parseInt(currentBand) };
    }

    if (skill) query.skill = skill;

    const tips = await BandScoreTip.find(query)
      .sort({ targetBand: 1 })
      .limit(10);

    res.json(tips);
  } catch (err) {
    next(err);
  }
}

// Create band score tip (admin only)
async function createBandScoreTip(req, res, next) {
  try {
    const tip = await BandScoreTip.create(req.body);
    res.status(201).json(tip);
  } catch (err) {
    next(err);
  }
}

// Update band score tip (admin only)
async function updateBandScoreTip(req, res, next) {
  try {
    const tip = await BandScoreTip.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!tip) {
      return res.status(404).json({ error: 'Tip not found' });
    }

    res.json(tip);
  } catch (err) {
    next(err);
  }
}

// Delete band score tip (admin only)
async function deleteBandScoreTip(req, res, next) {
  try {
    const tip = await BandScoreTip.findByIdAndDelete(req.params.id);

    if (!tip) {
      return res.status(404).json({ error: 'Tip not found' });
    }

    res.json({ message: 'Tip deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getBandScoreTips,
  getPersonalizedTips,
  createBandScoreTip,
  updateBandScoreTip,
  deleteBandScoreTip
};