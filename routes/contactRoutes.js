const express = require('express');
const { submitContact, submitFeedback, getAllSubmissions } = require('../controllers/contactController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/contact', submitContact);
router.post('/feedback', protect, submitFeedback);
router.get('/submissions', protect, restrictTo('admin'), getAllSubmissions);

module.exports = router;