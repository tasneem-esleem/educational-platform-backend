const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
    },
    subject: {
      type: String,
      default: '',
    },
    grade: {
      type: String,
      default: '',
    },
    gradeLabel: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    longDescription: {
      type: String,
      default: '',
    },
    cover: {
      type: String,
      default: '',
    },
    teacher: {
      type: String,
      default: '',
    },
    fileUrl: {
      type: String,
      default: '',
    },
    // أبقينا category كحقل اختياري احتياطي (بعض الكود القديم قد يقرأه)،
    // لكن الفلترة الفعلية بـ getBooks تعتمد الآن على subject.
    category: {
      type: String,
      default: '',
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      default: null,
    },
  },
  { timestamps: true, strict: false }
);

module.exports = mongoose.model('Book', bookSchema);
