const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Assignment title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Assignment description is required'],
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course reference is required'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator reference is required'],
    },
    submissions: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        fileUrl: String,
        submittedAt: {
          type: Date,
          default: Date.now,
        },
        grade: String,
        feedback: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Assignment', assignmentSchema);