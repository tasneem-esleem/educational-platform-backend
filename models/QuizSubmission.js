const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    selectedOption: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
    pointsAwarded: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const quizSubmissionSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    answers: {
      type: [answerSchema],
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    totalPoints: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    passed: {
      type: Boolean,
      required: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

quizSubmissionSchema.index({ quiz: 1, student: 1 });

module.exports = mongoose.model('QuizSubmission', quizSubmissionSchema);
