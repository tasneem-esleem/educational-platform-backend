const express = require('express');
const {
  createQuiz,
  getQuizzesByCourse,
  getQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  getMySubmission,
  getQuizSubmissions,
} = require('../controllers/quizController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { validate, quizValidationRules, quizSubmissionValidationRules } = require('../middleware/validators');

const router = express.Router();

router.use(protect);

router.post('/', restrictTo('instructor', 'admin'), quizValidationRules, validate, createQuiz);
router.get('/course/:courseId', getQuizzesByCourse);

router.get('/:id', getQuiz);
router.patch('/:id', restrictTo('instructor', 'admin'), updateQuiz);
router.delete('/:id', restrictTo('instructor', 'admin'), deleteQuiz);

router.post('/:id/submit', restrictTo('student'), quizSubmissionValidationRules, validate, submitQuiz);
router.get('/:id/my-submission', restrictTo('student'), getMySubmission);
router.get('/:id/submissions', restrictTo('instructor', 'admin'), getQuizSubmissions);

module.exports = router;
