const asyncHandler = require('express-async-handler');
const Assignment = require('../models/Assignment');
const AppError = require('../utils/AppError');
const sendResponse = require('../utils/sendResponse');

const getAssignments = asyncHandler(async (req, res) => {
  const { subject, courseId } = req.query;

  const filter = {};
  if (subject) filter.subject = subject;
  if (courseId) filter.course = courseId;

  const assignments = await Assignment.find(filter)
    .populate('course', 'title')
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 });

  return sendResponse(res, 200, assignments, null, { results: assignments.length });
});

const createAssignment = asyncHandler(async (req, res) => {
  const { title, description, dueDate, courseId } = req.body;

  if (!title || !description || !dueDate || !courseId) {
    throw new AppError('Please provide all required fields', 400);
  }

  const assignment = await Assignment.create({
    title,
    description,
    dueDate,
    course: courseId,
    createdBy: req.user._id,
  });

  return sendResponse(res, 201, assignment, 'Assignment created successfully');
});

const submitAssignment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { fileUrl } = req.body;

  if (!fileUrl) {
    throw new AppError('Please provide a file URL for submission', 400);
  }

  const assignment = await Assignment.findById(id);
  if (!assignment) {
    throw new AppError('Assignment not found', 404);
  }

  assignment.submissions.push({
    student: req.user._id,
    fileUrl,
  });

  await assignment.save();

  return sendResponse(res, 200, assignment, 'Assignment submitted successfully');
});

const markAssignmentComplete = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const assignment = await Assignment.findById(id);
  if (!assignment) {
    throw new AppError('Assignment not found', 404);
  }

  const alreadySubmitted = assignment.submissions.some(
    (s) => s.student.toString() === req.user._id.toString()
  );

  if (alreadySubmitted) {
    return sendResponse(res, 200, assignment, 'Already marked as completed');
  }

  assignment.submissions.push({
    student: req.user._id,
    submittedAt: new Date(),
  });

  await assignment.save();

  return sendResponse(res, 200, assignment, 'Assignment marked as completed');
});

module.exports = { getAssignments, createAssignment, submitAssignment, markAssignmentComplete };
