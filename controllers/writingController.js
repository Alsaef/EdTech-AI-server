const WritingSubmission = require('../models/WritingSubmission');
const gemini = require('../utils/gemini');

// Submit writing for feedback
async function submitWriting(req, res, next) {
  try {
    const { taskType, topic, content } = req.body;
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;

    const submission = await WritingSubmission.create({
      user: req.user.id,
      taskType,
      topic,
      content,
      wordCount
    });

    // Generate AI feedback asynchronously
    generateAIFeedback(submission._id);

    res.status(201).json({
      submission: {
        id: submission._id,
        taskType: submission.taskType,
        topic: submission.topic,
        content: submission.content,
        wordCount: submission.wordCount,
        status: submission.status,
        createdAt: submission.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
}

// Get user's writing submissions
async function getUserSubmissions(req, res, next) {
  try {
    const submissions = await WritingSubmission.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (err) {
    next(err);
  }
}

// Get specific submission with feedback
async function getSubmission(req, res, next) {
  try {
    const submission = await WritingSubmission.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    res.json(submission);
  } catch (err) {
    next(err);
  }
}

// Get all submissions (admin only)
async function getAllSubmissions(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const submissions = await WritingSubmission.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await WritingSubmission.countDocuments();

    res.json({
      submissions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
}

// Generate AI feedback (internal function)
async function generateAIFeedback(submissionId) {
  try {
    const submission = await WritingSubmission.findById(submissionId);
    if (!submission) return;

    const prompt = `Please analyze this IELTS Writing ${submission.taskType} essay and provide detailed feedback:

Topic: ${submission.topic}

Essay:
${submission.content}

Please provide:
1. Overall band score (0-9)
2. Grammar score (0-9)
3. Coherence and cohesion score (0-9)
4. Lexical resource score (0-9)
5. Detailed feedback on strengths and weaknesses
6. Specific suggestions for improvement
7. An improved version of the essay

Format your response as JSON with keys: score, grammarScore, coherenceScore, lexicalScore, feedback, suggestions (array), improvedVersion`;

    const aiResponse = await gemini.generateText(prompt);

    // Parse AI response (assuming it returns JSON)
    let feedbackData;
    try {
      feedbackData = JSON.parse(aiResponse);
    } catch (e) {
      // Fallback if AI doesn't return valid JSON
      feedbackData = {
        score: 6.0,
        grammarScore: 6.0,
        coherenceScore: 6.0,
        lexicalScore: 6.0,
        feedback: aiResponse,
        suggestions: ['Please review your essay structure', 'Work on grammar accuracy'],
        improvedVersion: submission.content
      };
    }

    await WritingSubmission.findByIdAndUpdate(submissionId, {
      aiFeedback: feedbackData,
      status: 'reviewed',
      reviewedAt: new Date()
    });

  } catch (err) {
    console.error('Error generating AI feedback:', err);
  }
}

module.exports = {
  submitWriting,
  getUserSubmissions,
  getSubmission,
  getAllSubmissions,
  generateAIFeedback
};