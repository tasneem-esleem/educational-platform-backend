require('dotenv').config();
const mongoose = require('mongoose');
const Lesson = require('./models/Lesson');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  console.log('Connecting to:', uri);
  await mongoose.connect(uri);
  console.log('MongoDB Connected');
};
const lessons = [
  { bookId: 3, title: "Atomic Structure", description: "Chemistry - Grade 10", videoUrl: "https://youtu.be/OH-aSu-rWgk?si=_35KaVsG_g23aPHt", duration: "45 min", thumbnail: "https://i.ibb.co/sJKRRPGZ/Rectangle-276.png" },
  { bookId: 3, title: "Atom Theory", description: "Chemistry - Grade 10", videoUrl: "https://youtu.be/QlgkN17V94c?si=vfCfsHFtNHB6OOJD", duration: "38 min", thumbnail: "https://i.ibb.co/BKzSnd8R/Rectangle-280.png" },
  { bookId: 3, title: "Energy Levels Of The Atom", description: "Chemistry - Grade 10", videoUrl: "https://youtu.be/4sLXUr2HWIs?si=P9ZHwEYD7u0Vz6FF", duration: "50 min", thumbnail: "https://i.ibb.co/zhJZHNSK/Rectangle-285.png" },
  { bookId: 4, title: "Cell Installation", description: "Biology - Grade 10", videoUrl: "https://youtu.be/URUJD5NEXC8?si=EWEM0pbGFZUAkLAN", duration: "40 min", thumbnail: "https://i.ibb.co/yn6Tbfpm/Rectangle-276-1.png" },
  { bookId: 4, title: "Installation Of Microscopes", description: "Biology - Grade 10", videoUrl: "https://youtu.be/gqAcFKGztoY?si=Jvor6HWe_WR4xR1l", duration: "35 min", thumbnail: "https://i.ibb.co/W4vGhj3g/Rectangle-289.png" },
  { bookId: 4, title: "Plant Cell Structure", description: "Biology - Grade 10", videoUrl: "https://youtu.be/NTunJq9LtS0?si=q2aahrlHfG0Lsf6B", duration: "42 min", thumbnail: "https://i.ibb.co/60wWFkht/Rectangle-285-1.png" },
  { bookId: 4, title: "Animal Cell Structure", description: "Biology - Grade 10", videoUrl: "https://youtu.be/5ugDJhmmkFM?si=SmIugb72rKkTrWzT", duration: "44 min", thumbnail: "https://i.ibb.co/fj31kbS/Rectangle-287.png" },
  { bookId: 5, title: "Pair Pairing", description: "Math - First year", videoUrl: "https://youtu.be/fKyBOLsqRlo?si=mKCj19LrOKXLj51z", duration: "17:47 mins", thumbnail: "https://i.ibb.co/8ncKwW9v/Rectangle-280-1.png" },
  { bookId: 5, title: "Individual Pairing", description: "Math - First year", videoUrl: "https://youtu.be/OWvFieszqmY?si=rmZKYDHQlcyXtTPi", duration: "2:21 mins", thumbnail: "https://i.ibb.co/8ncKwW9v/Rectangle-280-1.png" },
  { bookId: 5, title: "Statistics", description: "Math - First year", videoUrl: "https://youtu.be/XZo4xyJXCak?si=xYax_feLY-9f8noQ", duration: "56:46 mins", thumbnail: "https://i.ibb.co/ycj6v42y/Rectangle-285-2.png" },
  { bookId: 6, title: "Vectors", description: "Physics - First year", videoUrl: "https://youtu.be/EwSHKuSxX_8?si=APoFfipprSqVRYGf", duration: "12:13 mins", thumbnail: "https://i.ibb.co/ZzQTgCr0/Rectangle-276-2.png" },
  { bookId: 6, title: "Measurement", description: "Physics - First year", videoUrl: "https://youtu.be/oStm8sGk6U8?si=0z9v0MDH-cv9cLaT", duration: "4:28 mins", thumbnail: "https://i.ibb.co/HDqjZmDH/Rectangle-280-2.png" },
  { bookId: 6, title: "Newton's Laws", description: "Physics - First year", videoUrl: "https://youtu.be/g550H4e5FCY?si=sM8ENRYpWas-jIiU", duration: "38:23 mins", thumbnail: "https://i.ibb.co/V0H214rD/Rectangle-285-3.png" },
  { bookId: 7, title: "Industrial Revolution", description: "History - First year", videoUrl: "https://youtu.be/R8OmJiYwY6I?si=DSGv8jCB17V_iRIF", duration: "22:47 mins", thumbnail: "https://i.ibb.co/Tx4BTX8t/Rectangle-285-4.png" },
  { bookId: 7, title: "Persian Empire", description: "History - First year", videoUrl: "https://youtu.be/yN4F25Of3E4?si=Zur4EyiJfGxsos-T", duration: "9:04 mins", thumbnail: "https://i.ibb.co/Tx4BTX8t/Rectangle-285-4.png" },
  { bookId: 7, title: "Ottoman Empire", description: "History - First year", videoUrl: "https://youtu.be/ajRdOHmYw74?si=gV0U4aNWEBnXBIiL", duration: "21:35 mins", thumbnail: "https://i.ibb.co/Tx4BTX8t/Rectangle-285-4.png" },
  { bookId: 8, title: "Atmosphere", description: "Geography - First year", videoUrl: "https://youtu.be/7s5uow5b02M?si=QrcAT1kEcLAimxk_", duration: "8:34 mins", thumbnail: "https://i.ibb.co/S4GpzLqG/Rectangle-276-3.png" },
  { bookId: 8, title: "Tourism components", description: "Geography - First year", videoUrl: "https://youtu.be/dAsL48QgSl4?si=Datw--gT9x5r15IP", duration: "10:52 mins", thumbnail: "https://i.ibb.co/8nKWzk46/Rectangle-280-3.png" },
  { bookId: 8, title: "Satellites", description: "Geography - First year", videoUrl: "https://youtube.com/watch?v=_IiPMG43L54&feature=shared", duration: "4:59 mins", thumbnail: "https://i.ibb.co/Mx3LBPZk/Rectangle-285-5.png" },
  { bookId: 9, title: "Present Simple", description: "English - First year", videoUrl: "https://youtu.be/nvVdIJ0las0?si=NdBrwoKxbYYX8iq6", duration: "4:50 mins", thumbnail: "https://i.ibb.co/ZRbFMRXy/Rectangle-285-6.png" },
  { bookId: 9, title: "Present Continuous", description: "English - First year", videoUrl: "https://youtu.be/QqxdZzOorAU?si=sqpoyAeO_lsSe8iJ", duration: "4:25 mins", thumbnail: "https://i.ibb.co/ZRbFMRXy/Rectangle-285-6.png" },
  { bookId: 9, title: "Present Perfect", description: "English - First year", videoUrl: "https://youtu.be/553eeL1Dvho?si=lpwIAGahnAVVmrK-", duration: "5:56 mins", thumbnail: "https://i.ibb.co/ZRbFMRXy/Rectangle-285-6.png" },
  { bookId: 10, title: "Passive Participle", description: "Arabic - First year", videoUrl: "https://youtu.be/jl0wuhg04so?si=LlmtwZzWGxf-vBOF", duration: "4:03 mins", thumbnail: "https://i.ibb.co/nqVgJYpK/Rectangle-276-4.png" },
  { bookId: 10, title: "Active Participle", description: "Arabic - First year", videoUrl: "https://youtu.be/_esb2cngrp4?si=LNeJRkognG0v3yq_", duration: "19:36 mins", thumbnail: "https://i.ibb.co/1JpYyWrF/Rectangle-280-4.png" },
  { bookId: 10, title: "Attached Pronouns", description: "Arabic - First year", videoUrl: "https://youtu.be/hwjhNG7dHRo?si=e2qZCq9AcwV6j7QK", duration: "9:44 mins", thumbnail: "https://i.ibb.co/xK1jDXZv/Rectangle-285-7.png" },
];

const seedDB = async () => {
  try {
    await connectDB();
    await Lesson.deleteMany({});
    console.log('Old lessons deleted');

    const formatted = lessons.map((l, i) => ({
      title: l.title,
      description: l.description,
      videoUrl: l.videoUrl,
      duration: l.duration,
      course: new mongoose.Types.ObjectId('000000000000000000000' + String(l.bookId).padStart(3, '0')),
      order: i,
    }));

    await Lesson.insertMany(formatted);
    console.log(`✅ ${formatted.length} lessons inserted successfully`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding:', err);
    process.exit(1);
  }
};

seedDB();