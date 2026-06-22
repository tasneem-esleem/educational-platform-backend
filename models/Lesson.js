const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    videoUrl: {
      type: String,
      default: '',
    },
    duration: {
      type: String,
      default: '0:00',
    },
   subject: {
  type: String,
  default: '',
},
grade: {
  type: String,
  default: '',
},
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course reference is required'],
    },
    order: {
      type: Number,
      default: 0,
    },
     thumbnail: {       
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lesson', lessonSchema);