const mongoose = require('mongoose');

const VocabularySuggestionSchema = new mongoose.Schema({
  word: { type: String, required: true },
  definition: { type: String, required: true },
  synonyms: [{ type: String }],
  antonyms: [{ type: String }],
  examples: [{ type: String }],
  category: { type: String, enum: ['academic', 'general', 'business'], default: 'general' },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VocabularySuggestion', VocabularySuggestionSchema);