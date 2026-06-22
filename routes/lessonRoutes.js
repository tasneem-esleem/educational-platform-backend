const express = require('express');
const { getLessonsByCourse, getLessonsByBook, createLesson } = require('../controllers/lessonController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', async (req, res, next) => {
  const bookId = req.query.bookId || req.query.courseId;
  const paddedId = '000000000000000000000' + String(bookId).padStart(3, '0');
  req.params.courseId = paddedId;
  next();
}, getLessonsByCourse);

router.get('/course/:courseId', async (req, res, next) => {
  const bookId = req.params.courseId;
  const paddedId = '000000000000000000000' + String(bookId).padStart(3, '0');
  req.params.courseId = paddedId;
  next();
}, getLessonsByCourse);


router.get('/by-book/:bookId', getLessonsByBook);

router.post('/', protect, createLesson);

module.exports = router;