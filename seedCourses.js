require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  console.log('Connecting to:', uri);
  await mongoose.connect(uri);
  console.log('MongoDB Connected');
};

const INSTRUCTOR_ID = '6a3127b18edfeb16d5cb218d';

const courses = [
  {
    _id: new mongoose.Types.ObjectId('000000000000000000000003'),
    title: 'Chemistry - Grade 10',
    description: 'Chemistry course for Grade 10 students',
    category: 'Science',
    thumbnail: 'https://i.ibb.co/sJKRRPGZ/Rectangle-276.png',
    level: 'intermediate',
    price: 0,
    isPublished: true,
    instructor: new mongoose.Types.ObjectId(INSTRUCTOR_ID),
  },
  {
    _id: new mongoose.Types.ObjectId('000000000000000000000004'),
    title: 'Biology - Grade 10',
    description: 'Biology course for Grade 10 students',
    category: 'Science',
    thumbnail: 'https://i.ibb.co/yn6Tbfpm/Rectangle-276-1.png',
    level: 'intermediate',
    price: 0,
    isPublished: true,
    instructor: new mongoose.Types.ObjectId(INSTRUCTOR_ID),
  },
  {
    _id: new mongoose.Types.ObjectId('000000000000000000000005'),
    title: 'Math - First year',
    description: 'Mathematics course for First year students',
    category: 'Mathematics',
    thumbnail: 'https://i.ibb.co/8ncKwW9v/Rectangle-280-1.png',
    level: 'beginner',
    price: 0,
    isPublished: true,
    instructor: new mongoose.Types.ObjectId(INSTRUCTOR_ID),
  },
  {
    _id: new mongoose.Types.ObjectId('000000000000000000000006'),
    title: 'Physics - First year',
    description: 'Physics course for First year students',
    category: 'Science',
    thumbnail: 'https://i.ibb.co/ZzQTgCr0/Rectangle-276-2.png',
    level: 'beginner',
    price: 0,
    isPublished: true,
    instructor: new mongoose.Types.ObjectId(INSTRUCTOR_ID),
  },
  {
    _id: new mongoose.Types.ObjectId('000000000000000000000007'),
    title: 'History - First year',
    description: 'History course for First year students',
    category: 'Humanities',
    thumbnail: 'https://i.ibb.co/Tx4BTX8t/Rectangle-285-4.png',
    level: 'beginner',
    price: 0,
    isPublished: true,
    instructor: new mongoose.Types.ObjectId(INSTRUCTOR_ID),
  },
  {
    _id: new mongoose.Types.ObjectId('000000000000000000000008'),
    title: 'Geography - First year',
    description: 'Geography course for First year students',
    category: 'Humanities',
    thumbnail: 'https://i.ibb.co/S4GpzLqG/Rectangle-276-3.png',
    level: 'beginner',
    price: 0,
    isPublished: true,
    instructor: new mongoose.Types.ObjectId(INSTRUCTOR_ID),
  },
  {
    _id: new mongoose.Types.ObjectId('000000000000000000000009'),
    title: 'English - First year',
    description: 'English course for First year students',
    category: 'Languages',
    thumbnail: 'https://i.ibb.co/ZRbFMRXy/Rectangle-285-6.png',
    level: 'beginner',
    price: 0,
    isPublished: true,
    instructor: new mongoose.Types.ObjectId(INSTRUCTOR_ID),
  },
  {
    _id: new mongoose.Types.ObjectId('000000000000000000000010'),
    title: 'Arabic - First year',
    description: 'Arabic course for First year students',
    category: 'Languages',
    thumbnail: 'https://i.ibb.co/nqVgJYpK/Rectangle-276-4.png',
    level: 'beginner',
    price: 0,
    isPublished: true,
    instructor: new mongoose.Types.ObjectId(INSTRUCTOR_ID),
  },
];

const seedDB = async () => {
  try {
    await connectDB();
    await Course.deleteMany({});
    console.log('Old courses deleted');

    await Course.insertMany(courses);
    console.log(`✅ ${courses.length} courses inserted successfully`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding:', err);
    process.exit(1);
  }
};

seedDB();