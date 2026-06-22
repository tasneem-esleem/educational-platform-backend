const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Option text is required'],
      trim: true,
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    options: {
      type: [optionSchema],
      validate: {
        validator: (options) => options.length >= 2,
        message: 'A question must have at least 2 options',
      },
    },
    points: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  { _id: true }
);

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    questions: {
      type: [questionSchema],
      validate: {
        validator: (questions) => questions.length > 0,
        message: 'A quiz must have at least one question',
      },
    },
    timeLimit: {
      type: Number,
      default: 0,
    },
    passingScore: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

quizSchema.virtual('totalPoints').get(function () {
  return this.questions.reduce((sum, q) => sum + q.points, 0);
});

quizSchema.set('toJSON', { virtuals: true });
quizSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Quiz', quizSchema);
