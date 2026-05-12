const mongoose = require('mongoose');

const WritingSubmissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taskType: { type: String, enum: ['task1', 'task2'], required: true },
  topic: { type: String, required: true },
  content: { type: String, required: true },
  wordCount: { type: Number },
  aiFeedback: {
    score: { type: Number, min: 0, max: 9 },
    grammarScore: { type: Number, min: 0, max: 9 },
    coherenceScore: { type: Number, min: 0, max: 9 },
    lexicalScore: { type: Number, min: 0, max: 9 },
    feedback: { type: String },
    suggestions: [{ type: String }],
    improvedVersion: { type: String }
  },
  status: { type: String, enum: ['pending', 'reviewed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  reviewedAt: { type: Date }
});

module.exports = mongoose.model('WritingSubmission', WritingSubmissionSchema);