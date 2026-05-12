const mongoose = require('mongoose');

const SpeakingQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  category: { type: String, enum: ['part1', 'part2', 'part3'], required: true },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
  sampleAnswer: { type: String },
  tips: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SpeakingQuestion', SpeakingQuestionSchema);