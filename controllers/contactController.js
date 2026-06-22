const asyncHandler = require('express-async-handler');
const Contact = require('../models/Contact');
const AppError = require('../utils/AppError');
const sendResponse = require('../utils/sendResponse');

const submitContact = asyncHandler(async (req, res) => {
  const { name, email, subject, message, phone } = req.body;

  if (!name || !email || !message) {
    throw new AppError('Please provide name, email, and message', 400);
  }

  const fullMessage = phone ? `Phone: ${phone}\n${message}` : message;

  const contact = await Contact.create({
    name,
    email,
    subject,
    message: fullMessage,
    type: 'contact',
  });

  return sendResponse(res, 201, contact, 'Your message has been sent successfully');
});

const submitFeedback = asyncHandler(async (req, res) => {
  const { rating, comment, enjoy } = req.body;

  if (!comment) {
    throw new AppError('Comment is required for feedback', 400);
  }

  const message = `Enjoying platform: ${enjoy === 'yes' ? 'Yes' : 'No'}. Comment: ${comment}`;

  const feedback = await Contact.create({
    name: req.user.name,
    email: req.user.email,
    message,
    rating: rating || 5,
    type: 'feedback',
  });

  return sendResponse(res, 201, feedback, 'Thank you for your feedback');
});

const getAllSubmissions = asyncHandler(async (req, res) => {
  const submissions = await Contact.find().sort({ createdAt: -1 });

  return sendResponse(res, 200, submissions, null, { results: submissions.length });
});

module.exports = { submitContact, submitFeedback, getAllSubmissions };
