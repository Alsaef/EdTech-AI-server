require('dotenv').config();
const mongoose = require('mongoose');
const SpeakingQuestion = require('./models/SpeakingQuestion');
const VocabularySuggestion = require('./models/VocabularySuggestion');
const BandScoreTip = require('./models/BandScoreTip');

async function seedData() {
  try {
    // Connect to MongoDB
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error('MONGO_URI not set in environment');

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });
    console.log('Connected to MongoDB for seeding');

    // Clear existing data
    await SpeakingQuestion.deleteMany({});
    await VocabularySuggestion.deleteMany({});
    await BandScoreTip.deleteMany({});
    console.log('Cleared existing data');

    // Seed Speaking Questions
    const speakingQuestions = [
      {
        question: "Describe your favorite hobby and explain why you enjoy it.",
        category: "part1",
        difficulty: "beginner",
        sampleAnswer: "My favorite hobby is reading books. I enjoy it because it helps me relax and learn new things.",
        tips: ["Be specific about what you do", "Explain the reasons clearly", "Use descriptive language"]
      },
      {
        question: "Some people think that social media has a negative impact on society. What is your opinion?",
        category: "part2",
        difficulty: "intermediate",
        sampleAnswer: "While social media has some drawbacks, I believe its benefits outweigh the negatives...",
        tips: ["Give a balanced view", "Support your opinion with examples", "Use linking words"]
      },
      {
        question: "Do you think technology has improved our lives? Give reasons for your answer.",
        category: "part3",
        difficulty: "advanced",
        sampleAnswer: "Technology has undoubtedly improved our lives in many ways...",
        tips: ["Discuss both sides", "Use complex sentences", "Provide specific examples"]
      }
    ];

    await SpeakingQuestion.insertMany(speakingQuestions);
    console.log('Speaking questions seeded');

    // Seed Vocabulary Suggestions
    const vocabulary = [
      {
        word: "ubiquitous",
        definition: "Present, appearing, or found everywhere",
        synonyms: ["omnipresent", "pervasive", "universal"],
        antonyms: ["rare", "scarce", "uncommon"],
        examples: [
          "Smartphones have become ubiquitous in modern society.",
          "The internet is ubiquitous in developed countries."
        ],
        category: "academic",
        difficulty: "advanced"
      },
      {
        word: "mitigate",
        definition: "To make less severe, serious, or painful",
        synonyms: ["alleviate", "reduce", "lessen"],
        antonyms: ["worsen", "exacerbate", "intensify"],
        examples: [
          "We need to mitigate the effects of climate change.",
          "Exercise can help mitigate stress levels."
        ],
        category: "academic",
        difficulty: "intermediate"
      },
      {
        word: "pragmatic",
        definition: "Dealing with things sensibly and realistically",
        synonyms: ["practical", "realistic", "sensible"],
        antonyms: ["idealistic", "impractical", "theoretical"],
        examples: [
          "We need a pragmatic approach to solving this problem.",
          "Her pragmatic decision saved the company money."
        ],
        category: "business",
        difficulty: "intermediate"
      }
    ];

    await VocabularySuggestion.insertMany(vocabulary);
    console.log('Vocabulary suggestions seeded');

    // Seed Band Score Tips
    const bandTips = [
      {
        targetBand: 7.0,
        skill: "speaking",
        tip: "Use a wide range of vocabulary naturally and flexibly. Paraphrase effectively and use less common words.",
        category: "general"
      },
      {
        targetBand: 8.0,
        skill: "writing",
        tip: "Write in a fully developed, coherent way with effective use of cohesive devices. Use a wide range of vocabulary with full control.",
        category: "general"
      },
      {
        targetBand: 6.5,
        skill: "listening",
        tip: "Understand main ideas and most detailed information. May miss some implied meanings in unfamiliar situations.",
        category: "specific"
      }
    ];

    await BandScoreTip.insertMany(bandTips);
    console.log('Band score tips seeded');

    console.log('All data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();