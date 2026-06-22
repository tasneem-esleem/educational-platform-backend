const asyncHandler = require('express-async-handler');
const Lesson = require('../models/Lesson');
const Book = require('../models/Book');
const AppError = require('../utils/AppError');
const sendResponse = require('../utils/sendResponse');

const getLessonsByCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const lessons = await Lesson.find({ course: courseId }).sort({ order: 1 });

  return sendResponse(res, 200, lessons, null, { results: lessons.length });
});

const getLessonsByBook = asyncHandler(async (req, res) => {
  const { bookId } = req.params;

  const book = await Book.findById(bookId);

  if (!book) {
    throw new AppError('Book not found', 404);
  }

  if (!book.course) {
    return sendResponse(res, 200, [], null, { results: 0 });
  }

  const lessons = await Lesson.find({ course: book.course }).sort({ order: 1 });

  return sendResponse(res, 200, lessons, null, { results: lessons.length });
});

const createLesson = asyncHandler(async (req, res) => {
  const { title, description, videoUrl, duration, courseId, order } = req.body;

  if (!title || !courseId) {
    throw new AppError('Lesson title and course ID are required', 400);
  }

  const lesson = await Lesson.create({
    title,
    description,
    videoUrl,
    duration,
    course: courseId,
    order: order || 0,
  });

  return sendResponse(res, 201, lesson, 'Lesson created successfully');
});

module.exports = { getLessonsByCourse, getLessonsByBook, createLesson };
