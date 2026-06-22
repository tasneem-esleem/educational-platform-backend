const asyncHandler = require('express-async-handler');
const Book = require('../models/Book');
const AppError = require('../utils/AppError');
const sendResponse = require('../utils/sendResponse');

const getBooks = asyncHandler(async (req, res) => {

  const { subject, category } = req.query;
  const filter = {};
  if (subject) filter.subject = subject;
  if (category) filter.category = category;

  const books = await Book.find(filter);

  return sendResponse(res, 200, books, null, { results: books.length });
});

const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    throw new AppError('Book not found', 404);
  }

  return sendResponse(res, 200, book);
});

const createBook = asyncHandler(async (req, res) => {
  const { title, subject, grade, description, cover, teacher, fileUrl, course } = req.body;

  if (!title) {
    throw new AppError('Please provide a book title', 400);
  }

  const book = await Book.create({
    title,
    subject,
    grade,
    description,
    cover,
    teacher,
    fileUrl,
    course: course || null,
  });

  return sendResponse(res, 201, book, 'Book created successfully');
});

module.exports = { getBooks, getBookById, createBook };
