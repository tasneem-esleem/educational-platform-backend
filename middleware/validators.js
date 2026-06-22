const { body, validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map((err) => err.msg);
    throw new AppError(messages.join('. '), 400);
  }

  next();
};

const registerValidationRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['student', 'instructor']).withMessage('Role must be either student or instructor'),
];

const loginValidationRules = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

const courseValidationRules = [
  body('title').trim().notEmpty().withMessage('Course title is required'),
  body('description').trim().notEmpty().withMessage('Course description is required'),
  body('category').trim().notEmpty().withMessage('Course category is required'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('level').optional().isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid course level'),
];

const quizValidationRules = [
  body('title').trim().notEmpty().withMessage('Quiz title is required'),
  body('course').notEmpty().withMessage('Course ID is required').isMongoId().withMessage('Invalid course ID'),
  body('questions').isArray({ min: 1 }).withMessage('Quiz must contain at least one question'),
  body('questions.*.questionText').notEmpty().withMessage('Each question must have text'),
  body('questions.*.options').isArray({ min: 2 }).withMessage('Each question must have at least 2 options'),
];

const quizSubmissionValidationRules = [
  body('answers').isArray({ min: 1 }).withMessage('Answers must be a non-empty array'),
  body('answers.*.question').notEmpty().isMongoId().withMessage('Each answer must reference a valid question ID'),
  body('answers.*.selectedOption').notEmpty().isMongoId().withMessage('Each answer must reference a valid option ID'),
];

module.exports = {
  validate,
  registerValidationRules,
  loginValidationRules,
  courseValidationRules,
  quizValidationRules,
  quizSubmissionValidationRules,
};
