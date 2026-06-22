const express = require('express');
const { getAssignments, createAssignment, submitAssignment, markAssignmentComplete } = require('../controllers/assignmentController'); 
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAssignments)
  .post(createAssignment);

router.post('/:id/submit', submitAssignment);
router.patch('/:id/complete', markAssignmentComplete); 

module.exports = router;