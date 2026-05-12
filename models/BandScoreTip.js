const mongoose = require('mongoose');

const BandScoreTipSchema = new mongoose.Schema({
  targetBand: { type: Number, min: 0, max: 9, required: true },
  skill: { type: String, enum: ['speaking', 'writing', 'reading', 'listening'], required: true },
  tip: { type: String, required: true },
  category: { type: String, enum: ['general', 'specific'], default: 'general' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BandScoreTip', BandScoreTipSchema);