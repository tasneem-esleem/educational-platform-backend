const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    subject: {
      type: String,
      default: 'General Inquiry',
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
    },
    type: {
      type: String,
      enum: ['contact', 'feedback'],
      default: 'contact',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);