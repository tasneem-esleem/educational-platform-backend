const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const sendResponse = require('../utils/sendResponse');

const getAllCourses = asyncHandler(async (req, res) => {
  const { category, level, search } = req.query;

  const filter = { isPublished: true };

  if (category) filter.category = category;
  if (level) filter.level = level;
  if (search) filter.title = { $regex: search, $options: 'i' };

  const courses = await Course.find(filter)
    .populate('instructor', 'name avatar')
    .select('-lessons')
    .sort('-createdAt');

  return sendResponse(res, 200, courses, null, { count: courses.length });
});

const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate('instructor', 'name avatar bio');

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  return sendResponse(res, 200, course);
});

const createCourse = asyncHandler(async (req, res) => {
  const { title, description, category, thumbnail, price, level } = req.body;

  const course = await Course.create({
    title,
    description,
    category,
    thumbnail,
    price,
    level,
    instructor: req.user._id,
  });

  await User.findByIdAndUpdate(req.user._id, {
    $push: { createdCourses: course._id },
  });

  return sendResponse(res, 201, course, 'Course created successfully');
});

const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('You are not authorized to update this course', 403);
  }

  const allowedFields = ['title', 'description', 'category', 'thumbnail', 'price', 'level', 'isPublished'];
  const updates = {};

  Object.keys(req.body).forEach((key) => {
    if (allowedFields.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  const updatedCourse = await Course.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  return sendResponse(res, 200, updatedCourse, 'Course updated successfully');
});

const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('You are not authorized to delete this course', 403);
  }

  await course.deleteOne();

  await User.findByIdAndUpdate(course.instructor, {
    $pull: { createdCourses: course._id },
  });

  return sendResponse(res, 200, null, 'Course deleted successfully');
});

const addLesson = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('You are not authorized to modify this course', 403);
  }

  const { title, content, videoUrl, duration, order } = req.body;

  if (!title) {
    throw new AppError('Lesson title is required', 400);
  }

  course.lessons.push({ title, content, videoUrl, duration, order });
  await course.save();

  return sendResponse(res, 201, course, 'Lesson added successfully');
});

const enrollInCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  if (!course.isPublished) {
    throw new AppError('This course is not available for enrollment', 400);
  }

  if (course.enrolledStudents.includes(req.user._id)) {
    throw new AppError('You are already enrolled in this course', 409);
  }

  course.enrolledStudents.push(req.user._id);
  await course.save();

  await User.findByIdAndUpdate(req.user._id, {
    $push: { enrolledCourses: course._id },
  });

  return sendResponse(res, 200, course, 'Enrolled successfully');
});

const getMyCourses = asyncHandler(async (req, res) => {
  let courses;

  if (req.user.role === 'instructor' || req.user.role === 'admin') {
    courses = await Course.find({ instructor: req.user._id }).sort('-createdAt');
  } else {
    courses = await Course.find({ enrolledStudents: req.user._id })
      .populate('instructor', 'name avatar')
      .select('-lessons')
      .sort('-createdAt');
  }

  return sendResponse(res, 200, courses, null, { count: courses.length });
});

module.exports = {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  addLesson,
  enrollInCourse,
  getMyCourses,
};
