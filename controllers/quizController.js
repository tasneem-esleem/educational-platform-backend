const asyncHandler = require('express-async-handler');
const Quiz = require('../models/Quiz');
const QuizSubmission = require('../models/QuizSubmission');
const Course = require('../models/Course');
const AppError = require('../utils/AppError');
const sendResponse = require('../utils/sendResponse');

// CREATE QUIZ
const createQuiz = asyncHandler(async (req, res) => {
  const { course } = req.body;

  const targetCourse = await Course.findById(course);

  if (!targetCourse) {
    throw new AppError('Course not found', 404);
  }

  if (
    targetCourse.instructor.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    throw new AppError('Not authorized', 403);
  }

  const quiz = await Quiz.create({
    ...req.body,
    createdBy: req.user._id,
  });

  return sendResponse(res, 201, { quiz }, 'Quiz created successfully');
});

// GET BY COURSE
const getQuizzesByCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId);

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  const isOwner =
    course.instructor.toString() === req.user._id.toString() ||
    req.user.role === 'admin';

  const filter = { course: req.params.courseId };
  if (!isOwner) filter.isPublished = true;

  const quizzes = await Quiz.find(filter).select(
    isOwner ? '' : '-questions.options.isCorrect'
  );

  return sendResponse(
    res,
    200,
    { quizzes, count: quizzes.length },
    'Quizzes fetched successfully'
  );
});

// GET QUIZ
const getQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id).populate(
    'course',
    'title instructor'
  );

  if (!quiz) {
    throw new AppError('Quiz not found', 404);
  }

  const isOwner =
    quiz.createdBy.toString() === req.user._id.toString() ||
    req.user.role === 'admin';

  if (!isOwner) {
    const sanitizedQuiz = quiz.toObject();

    sanitizedQuiz.questions = sanitizedQuiz.questions.map((q) => ({
      ...q,
      options: q.options.map(({ isCorrect, ...rest }) => rest),
    }));

    return sendResponse(res, 200, { quiz: sanitizedQuiz });
  }

  return sendResponse(res, 200, { quiz });
});

// UPDATE QUIZ
const updateQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    throw new AppError('Quiz not found', 404);
  }

  if (
    quiz.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    throw new AppError('Not authorized', 403);
  }

  const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  return sendResponse(res, 200, { quiz: updatedQuiz }, 'Quiz updated');
});

// DELETE QUIZ
const deleteQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    throw new AppError('Quiz not found', 404);
  }

  if (
    quiz.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    throw new AppError('Not authorized', 403);
  }

  await quiz.deleteOne();
  await QuizSubmission.deleteMany({ quiz: quiz._id });

  return sendResponse(res, 200, null, 'Quiz deleted successfully');
});

// SUBMIT QUIZ
const submitQuiz = asyncHandler(async (req, res) => {
  const { answers } = req.body;

  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) throw new AppError('Quiz not found', 404);

  if (!quiz.isPublished)
    throw new AppError('Quiz not available', 400);

  const existing = await QuizSubmission.findOne({
    quiz: quiz._id,
    student: req.user._id,
  });

  if (existing) throw new AppError('Already submitted', 409);

  let score = 0;
  const totalPoints = quiz.totalPoints;
  const gradedAnswers = [];

  for (const answer of answers) {
    const question = quiz.questions.find(
      (q) => q._id.toString() === answer.question
    );

    if (!question)
      throw new AppError('Invalid question', 400);

    const option = question.options.find(
      (o) => o._id.toString() === answer.selectedOption
    );

    if (!option)
      throw new AppError('Invalid option', 400);

    const isCorrect = option.isCorrect;
    const points = isCorrect ? question.points : 0;

    score += points;

    gradedAnswers.push({
      question: question._id,
      selectedOption: option._id,
      isCorrect,
      pointsAwarded: points,
    });
  }

  const percentage =
    totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;

  const passed = percentage >= quiz.passingScore;

  const submission = await QuizSubmission.create({
    quiz: quiz._id,
    student: req.user._id,
    answers: gradedAnswers,
    score,
    totalPoints,
    percentage,
    passed,
  });

  return sendResponse(res, 201, {
    result: {
      score,
      totalPoints,
      percentage,
      passed,
      submissionId: submission._id,
    },
  });
});

// MY SUBMISSION
const getMySubmission = asyncHandler(async (req, res) => {
  const submission = await QuizSubmission.findOne({
    quiz: req.params.id,
    student: req.user._id,
  }).populate('quiz', 'title passingScore');

  if (!submission) {
    throw new AppError('No submission found', 404);
  }

  return sendResponse(res, 200, { submission });
});

// ALL SUBMISSIONS
const getQuizSubmissions = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) throw new AppError('Quiz not found', 404);

  if (
    quiz.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    throw new AppError('Not authorized', 403);
  }

  const submissions = await QuizSubmission.find({ quiz: req.params.id })
    .populate('student', 'name email avatar')
    .sort('-createdAt');

  return sendResponse(
    res,
    200,
    { submissions, count: submissions.length },
    'Submissions fetched'
  );
});

module.exports = {
  createQuiz,
  getQuizzesByCourse,
  getQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  getMySubmission,
  getQuizSubmissions,
};