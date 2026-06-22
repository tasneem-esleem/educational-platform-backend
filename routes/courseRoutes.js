const express = require('express');
const {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  addLesson,
  enrollInCourse,
  getMyCourses,
} = require('../controllers/courseController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { validate, courseValidationRules } = require('../middleware/validators');

const router = express.Router();

router.get('/', getAllCourses);
router.get('/my-courses', protect, getMyCourses);
router.get('/:id', getCourse);

router.post('/', protect, restrictTo('instructor', 'admin'), courseValidationRules, validate, createCourse);
router.patch('/:id', protect, restrictTo('instructor', 'admin'), updateCourse);
router.delete('/:id', protect, restrictTo('instructor', 'admin'), deleteCourse);

router.post('/:id/lessons', protect, restrictTo('instructor', 'admin'), addLesson);
router.post('/:id/enroll', protect, restrictTo('student'), enrollInCourse);

module.exports = router;
