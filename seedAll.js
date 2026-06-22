require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');
const Lesson = require('./models/Lesson');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  console.log('Connecting to:', uri);
  await mongoose.connect(uri);
  console.log('MongoDB Connected');
};

const INSTRUCTOR_ID = '6a3127b18edfeb16d5cb218d';

const courses = [
  { _id: '000000000000000000000003', title: 'Chemistry - Grade 10', description: 'Chemistry course for Grade 10', category: 'Science', thumbnail: 'https://i.ibb.co/sJKRRPGZ/Rectangle-276.png', level: 'intermediate' },
  { _id: '000000000000000000000004', title: 'Biology - Grade 10', description: 'Biology course for Grade 10', category: 'Science', thumbnail: 'https://i.ibb.co/yn6Tbfpm/Rectangle-276-1.png', level: 'intermediate' },
  { _id: '000000000000000000000005', title: 'Math - First year', description: 'Math course for First year', category: 'Mathematics', thumbnail: 'https://i.ibb.co/8ncKwW9v/Rectangle-280-1.png', level: 'beginner' },
  { _id: '000000000000000000000006', title: 'Physics - First year', description: 'Physics course for First year', category: 'Science', thumbnail: 'https://i.ibb.co/ZzQTgCr0/Rectangle-276-2.png', level: 'beginner' },
  { _id: '000000000000000000000007', title: 'History - First year', description: 'History course for First year', category: 'Humanities', thumbnail: 'https://i.ibb.co/Tx4BTX8t/Rectangle-285-4.png', level: 'beginner' },
  { _id: '000000000000000000000008', title: 'Geography - First year', description: 'Geography course for First year', category: 'Humanities', thumbnail: 'https://i.ibb.co/S4GpzLqG/Rectangle-276-3.png', level: 'beginner' },
  { _id: '000000000000000000000009', title: 'English - First year', description: 'English course for First year', category: 'Languages', thumbnail: 'https://i.ibb.co/ZRbFMRXy/Rectangle-285-6.png', level: 'beginner' },
  { _id: '000000000000000000000010', title: 'Arabic - First year', description: 'Arabic course for First year', category: 'Languages', thumbnail: 'https://i.ibb.co/nqVgJYpK/Rectangle-276-4.png', level: 'beginner' },
  { _id: '000000000000000000000011', title: 'History - Second year Literary', description: 'History course for Second year Literary', category: 'Humanities', thumbnail: 'https://i.ibb.co/B5q1807L/Rectangle-276-5.png', level: 'intermediate' },
  { _id: '000000000000000000000012', title: 'Geography - Second year Literary', description: 'Geography course for Second year Literary', category: 'Humanities', thumbnail: 'https://i.ibb.co/yFc6NPbK/Rectangle-276-6.png', level: 'intermediate' },
  { _id: '000000000000000000000013', title: 'English - Second year Literary', description: 'English course for Second year Literary', category: 'Languages', thumbnail: 'https://i.ibb.co/M51Gw15h/Rectangle-276-7.png', level: 'intermediate' },
  { _id: '000000000000000000000014', title: 'Chemistry - Second year Scientific', description: 'Chemistry course for Second year Scientific', category: 'Science', thumbnail: 'https://i.ibb.co/ym8413kG/Rectangle-276-8.png', level: 'intermediate' },
  { _id: '000000000000000000000015', title: 'Biology - Second year Scientific', description: 'Biology course for Second year Scientific', category: 'Science', thumbnail: 'https://i.ibb.co/39wvsmPv/Rectangle-276-9.png', level: 'intermediate' },
  { _id: '000000000000000000000016', title: 'Math - Second year Scientific', description: 'Math course for Second year Scientific', category: 'Mathematics', thumbnail: 'https://i.ibb.co/RTGDGDgD/Rectangle-276-10.png', level: 'intermediate' },
  { _id: '000000000000000000000017', title: 'Physics - Second year Scientific', description: 'Physics course for Second year Scientific', category: 'Science', thumbnail: 'https://i.ibb.co/Pv5TrsnC/Rectangle-276-11.png', level: 'intermediate' },
  { _id: '000000000000000000000018', title: 'History - Third year Literary', description: 'History course for Third year Literary', category: 'Humanities', thumbnail: 'https://i.ibb.co/B5q1807L/Rectangle-276-5.png', level: 'advanced' },
  { _id: '000000000000000000000019', title: 'Geography - Third year Literary', description: 'Geography course for Third year Literary', category: 'Humanities', thumbnail: 'https://i.ibb.co/r24hTpcD/Rectangle-276-12.png', level: 'advanced' },
  { _id: '000000000000000000000020', title: 'English - Third year Literary', description: 'English course for Third year Literary', category: 'Languages', thumbnail: 'https://i.ibb.co/NhXrvTV/Rectangle-285-17.png', level: 'advanced' },
  { _id: '000000000000000000000021', title: 'Arabic - Third year Literary', description: 'Arabic course for Third year Literary', category: 'Languages', thumbnail: 'https://i.ibb.co/nqVgJYpK/Rectangle-276-4.png', level: 'advanced' },
  { _id: '000000000000000000000022', title: 'Biology - Third year Scientific', description: 'Biology course for Third year Scientific', category: 'Science', thumbnail: 'https://i.ibb.co/x8mbBPDS/Rectangle-276-13.png', level: 'advanced' },
  { _id: '000000000000000000000023', title: 'Math - Third year Scientific', description: 'Math course for Third year Scientific', category: 'Mathematics', thumbnail: 'https://i.ibb.co/twP2MWXd/Rectangle-276-14.png', level: 'advanced' },
  { _id: '000000000000000000000024', title: 'Physics - Third year Scientific', description: 'Physics course for Third year Scientific', category: 'Science', thumbnail: 'https://i.ibb.co/27RQtgn1/Rectangle-276-15.png', level: 'advanced' },
  { _id: '000000000000000000000025', title: 'Chemistry - Third year Scientific', description: 'Chemistry course for Third year Scientific', category: 'Science', thumbnail: 'https://i.ibb.co/chsWKmfb/Rectangle-276-16.png', level: 'advanced' },
  { _id: '000000000000000000000026', title: 'Arabic - Second year Literary', description: 'Arabic course for Second year Literary', category: 'Languages', thumbnail: 'https://i.ibb.co/nqVgJYpK/Rectangle-276-4.png', level: 'intermediate' },
];

const lessons = [
  // bookId 3 - Chemistry Grade 10
  { bookId: 3, subject: 'Chemistry', grade: 'Grade 10', title: 'Atomic Structure', description: 'Chemistry - Grade 10', videoUrl: 'https://youtu.be/OH-aSu-rWgk?si=_35KaVsG_g23aPHt', duration: '45 min', thumbnail: 'https://i.ibb.co/sJKRRPGZ/Rectangle-276.png' },
  { bookId: 3, subject: 'Chemistry', grade: 'Grade 10', title: 'Atom Theory', description: 'Chemistry - Grade 10', videoUrl: 'https://youtu.be/QlgkN17V94c?si=vfCfsHFtNHB6OOJD', duration: '38 min', thumbnail: 'https://i.ibb.co/BKzSnd8R/Rectangle-280.png' },
  { bookId: 3, subject: 'Chemistry', grade: 'Grade 10', title: 'Energy Levels Of The Atom', description: 'Chemistry - Grade 10', videoUrl: 'https://youtu.be/4sLXUr2HWIs?si=P9ZHwEYD7u0Vz6FF', duration: '50 min', thumbnail: 'https://i.ibb.co/zhJZHNSK/Rectangle-285.png' },
  // bookId 4 - Biology Grade 10
  { bookId: 4, subject: 'Biology', grade: 'Grade 10', title: 'Cell Installation', description: 'Biology - Grade 10', videoUrl: 'https://youtu.be/URUJD5NEXC8?si=EWEM0pbGFZUAkLAN', duration: '40 min', thumbnail: 'https://i.ibb.co/yn6Tbfpm/Rectangle-276-1.png' },
  { bookId: 4, subject: 'Biology', grade: 'Grade 10', title: 'Installation Of Microscopes', description: 'Biology - Grade 10', videoUrl: 'https://youtu.be/gqAcFKGztoY?si=Jvor6HWe_WR4xR1l', duration: '35 min', thumbnail: 'https://i.ibb.co/W4vGhj3g/Rectangle-289.png' },
  { bookId: 4, subject: 'Biology', grade: 'Grade 10', title: 'Plant Cell Structure', description: 'Biology - Grade 10', videoUrl: 'https://youtu.be/NTunJq9LtS0?si=q2aahrlHfG0Lsf6B', duration: '42 min', thumbnail: 'https://i.ibb.co/60wWFkht/Rectangle-285-1.png' },
  { bookId: 4, subject: 'Biology', grade: 'Grade 10', title: 'Animal Cell Structure', description: 'Biology - Grade 10', videoUrl: 'https://youtu.be/5ugDJhmmkFM?si=SmIugb72rKkTrWzT', duration: '44 min', thumbnail: 'https://i.ibb.co/fj31kbS/Rectangle-287.png' },
  // bookId 5 - Math First year
  { bookId: 5, subject: 'Math', grade: 'First year of secondary school', title: 'Pair Pairing', description: 'Math - First year', videoUrl: 'https://youtu.be/fKyBOLsqRlo?si=mKCj19LrOKXLj51z', duration: '17:47 mins', thumbnail: 'https://i.ibb.co/8ncKwW9v/Rectangle-280-1.png' },
  { bookId: 5, subject: 'Math', grade: 'First year of secondary school', title: 'Individual Pairing', description: 'Math - First year', videoUrl: 'https://youtu.be/OWvFieszqmY?si=rmZKYDHQlcyXtTPi', duration: '2:21 mins', thumbnail: 'https://i.ibb.co/8ncKwW9v/Rectangle-280-1.png' },
  { bookId: 5, subject: 'Math', grade: 'First year of secondary school', title: 'Statistics', description: 'Math - First year', videoUrl: 'https://youtu.be/XZo4xyJXCak?si=xYax_feLY-9f8noQ', duration: '56:46 mins', thumbnail: 'https://i.ibb.co/ycj6v42y/Rectangle-285-2.png' },
  // bookId 6 - Physics First year
  { bookId: 6, subject: 'Physics', grade: 'First year of secondary school', title: 'Vectors', description: 'Physics - First year', videoUrl: 'https://youtu.be/EwSHKuSxX_8?si=APoFfipprSqVRYGf', duration: '12:13 mins', thumbnail: 'https://i.ibb.co/ZzQTgCr0/Rectangle-276-2.png' },
  { bookId: 6, subject: 'Physics', grade: 'First year of secondary school', title: 'Measurement', description: 'Physics - First year', videoUrl: 'https://youtu.be/oStm8sGk6U8?si=0z9v0MDH-cv9cLaT', duration: '4:28 mins', thumbnail: 'https://i.ibb.co/HDqjZmDH/Rectangle-280-2.png' },
  { bookId: 6, subject: 'Physics', grade: 'First year of secondary school', title: "Newton's Laws", description: 'Physics - First year', videoUrl: 'https://youtu.be/g550H4e5FCY?si=sM8ENRYpWas-jIiU', duration: '38:23 mins', thumbnail: 'https://i.ibb.co/V0H214rD/Rectangle-285-3.png' },
  // bookId 7 - History First year
  { bookId: 7, subject: 'History', grade: 'First year of secondary school', title: 'Industrial Revolution', description: 'History - First year', videoUrl: 'https://youtu.be/R8OmJiYwY6I?si=DSGv8jCB17V_iRIF', duration: '22:47 mins', thumbnail: 'https://i.ibb.co/Tx4BTX8t/Rectangle-285-4.png' },
  { bookId: 7, subject: 'History', grade: 'First year of secondary school', title: 'Persian Empire', description: 'History - First year', videoUrl: 'https://youtu.be/yN4F25Of3E4?si=Zur4EyiJfGxsos-T', duration: '9:04 mins', thumbnail: 'https://i.ibb.co/Tx4BTX8t/Rectangle-285-4.png' },
  { bookId: 7, subject: 'History', grade: 'First year of secondary school', title: 'Ottoman Empire', description: 'History - First year', videoUrl: 'https://youtu.be/ajRdOHmYw74?si=gV0U4aNWEBnXBIiL', duration: '21:35 mins', thumbnail: 'https://i.ibb.co/Tx4BTX8t/Rectangle-285-4.png' },
  // bookId 8 - Geography First year
  { bookId: 8, subject: 'Geography', grade: 'First year of secondary school', title: 'Atmosphere', description: 'Geography - First year', videoUrl: 'https://youtu.be/7s5uow5b02M?si=QrcAT1kEcLAimxk_', duration: '8:34 mins', thumbnail: 'https://i.ibb.co/S4GpzLqG/Rectangle-276-3.png' },
  { bookId: 8, subject: 'Geography', grade: 'First year of secondary school', title: 'Tourism components', description: 'Geography - First year', videoUrl: 'https://youtu.be/dAsL48QgSl4?si=Datw--gT9x5r15IP', duration: '10:52 mins', thumbnail: 'https://i.ibb.co/8nKWzk46/Rectangle-280-3.png' },
  { bookId: 8, subject: 'Geography', grade: 'First year of secondary school', title: 'Satellites', description: 'Geography - First year', videoUrl: 'https://youtube.com/watch?v=_IiPMG43L54&feature=shared', duration: '4:59 mins', thumbnail: 'https://i.ibb.co/Mx3LBPZk/Rectangle-285-5.png' },
  // bookId 9 - English First year
  { bookId: 9, subject: 'English', grade: 'First year of secondary school', title: 'Present Simple', description: 'English - First year', videoUrl: 'https://youtu.be/nvVdIJ0las0?si=NdBrwoKxbYYX8iq6', duration: '4:50 mins', thumbnail: 'https://i.ibb.co/ZRbFMRXy/Rectangle-285-6.png' },
  { bookId: 9, subject: 'English', grade: 'First year of secondary school', title: 'Present Continuous', description: 'English - First year', videoUrl: 'https://youtu.be/QqxdZzOorAU?si=sqpoyAeO_lsSe8iJ', duration: '4:25 mins', thumbnail: 'https://i.ibb.co/ZRbFMRXy/Rectangle-285-6.png' },
  { bookId: 9, subject: 'English', grade: 'First year of secondary school', title: 'Present Perfect', description: 'English - First year', videoUrl: 'https://youtu.be/553eeL1Dvho?si=lpwIAGahnAVVmrK-', duration: '5:56 mins', thumbnail: 'https://i.ibb.co/ZRbFMRXy/Rectangle-285-6.png' },
  // bookId 10 - Arabic First year
  { bookId: 10, subject: 'Arabic', grade: 'First year of secondary school', title: 'Passive Participle', description: 'Arabic - First year', videoUrl: 'https://youtu.be/jl0wuhg04so?si=LlmtwZzWGxf-vBOF', duration: '4:03 mins', thumbnail: 'https://i.ibb.co/nqVgJYpK/Rectangle-276-4.png' },
  { bookId: 10, subject: 'Arabic', grade: 'First year of secondary school', title: 'Active Participle', description: 'Arabic - First year', videoUrl: 'https://youtu.be/_esb2cngrp4?si=LNeJRkognG0v3yq_', duration: '19:36 mins', thumbnail: 'https://i.ibb.co/1JpYyWrF/Rectangle-280-4.png' },
  { bookId: 10, subject: 'Arabic', grade: 'First year of secondary school', title: 'Attached Pronouns', description: 'Arabic - First year', videoUrl: 'https://youtu.be/hwjhNG7dHRo?si=e2qZCq9AcwV6j7QK', duration: '9:44 mins', thumbnail: 'https://i.ibb.co/xK1jDXZv/Rectangle-285-7.png' },
  // bookId 11 - History Second year Literary
  { bookId: 11, subject: 'History', grade: 'Second year of secondary school (Literary)', title: 'French occupation', description: 'History - Second year Literary', videoUrl: 'https://youtu.be/0upgqMmbUy8?si=o9UKpoNL3vTj3tsK', duration: '3:56 mins', thumbnail: 'https://i.ibb.co/B5q1807L/Rectangle-276-5.png' },
  { bookId: 11, subject: 'History', grade: 'Second year of secondary school (Literary)', title: 'British Mandate', description: 'History - Second year Literary', videoUrl: 'https://youtu.be/mITaDOAUAQE?si=-D-4Y-YwdwB5aBYZ', duration: '3:47 mins', thumbnail: 'https://i.ibb.co/WNcm6HCH/Rectangle-280-5.png' },
  { bookId: 11, subject: 'History', grade: 'Second year of secondary school (Literary)', title: 'Italian settler colonialism', description: 'History - Second year Literary', videoUrl: 'https://youtu.be/GIgGw0OEbiI?si=rbQigJ8SwFl478sE', duration: '16:03 mins', thumbnail: 'https://i.ibb.co/JR4NqDbZ/Rectangle-285-8.png' },
  // bookId 12 - Geography Second year Literary
  { bookId: 12, subject: 'Geography', grade: 'Second year of secondary school (Literary)', title: 'The Solar System', description: 'Geography - Second year Literary', videoUrl: 'https://youtu.be/IH45r_ExTF8?si=Px_mnfHXl9PgQf24', duration: '17:54 mins', thumbnail: 'https://i.ibb.co/yFc6NPbK/Rectangle-276-6.png' },
  { bookId: 12, subject: 'Geography', grade: 'Second year of secondary school (Literary)', title: 'Planet Earth', description: 'Geography - Second year Literary', videoUrl: 'https://youtu.be/JGXi_9A__Vc?si=Ytw1KSlqXFu9lZGM', duration: '7:22 mins', thumbnail: 'https://i.ibb.co/nqmSGWV9/Rectangle-280-6.png' },
  { bookId: 12, subject: 'Geography', grade: 'Second year of secondary school (Literary)', title: 'The Moon', description: 'Geography - Second year Literary', videoUrl: 'https://youtu.be/mCzchPx3yF8?si=D8TZBCHBjRLbTwyH', duration: '9:51 mins', thumbnail: 'https://i.ibb.co/wZN2QnXp/Rectangle-285-9.png' },
  // bookId 13 - English Second year Literary
  { bookId: 13, subject: 'English', grade: 'Second year of secondary school (Literary)', title: 'Learning Style', description: 'English - Second year Literary', videoUrl: 'https://youtu.be/_IopcOwfsoU?si=samxj7J9_6vGBOFf', duration: '3:32 mins', thumbnail: 'https://i.ibb.co/M51Gw15h/Rectangle-276-7.png' },
  { bookId: 13, subject: 'English', grade: 'Second year of secondary school (Literary)', title: 'Tips Of Smart Learning', description: 'English - Second year Literary', videoUrl: 'https://youtu.be/oHPOZj69SDg?si=FuM_hy69M09N_fw1', duration: '8:58 mins', thumbnail: 'https://i.ibb.co/sdv1BzRv/Rectangle-280-7.png' },
  { bookId: 13, subject: 'English', grade: 'Second year of secondary school (Literary)', title: 'Education For Success', description: 'English - Second year Literary', videoUrl: 'https://youtu.be/6V3kTqGnX10?si=IWaZI-iObsa1e6IU', duration: '26:55 mins', thumbnail: 'https://i.ibb.co/Swz1nC49/Rectangle-285-10.png' },
  // bookId 14 - Chemistry Second year Scientific
  { bookId: 14, subject: 'Chemistry', grade: 'Second year of secondary school (Scientific)', title: 'Metals And Alloys', description: 'Chemistry - Second year Scientific', videoUrl: 'https://youtu.be/P4fFoGKwcFs?si=awuXPsaJrAU5ky6P', duration: '4:37 mins', thumbnail: 'https://i.ibb.co/ym8413kG/Rectangle-276-8.png' },
  { bookId: 14, subject: 'Chemistry', grade: 'Second year of secondary school (Scientific)', title: 'Oil And Natural Gas', description: 'Chemistry - Second year Scientific', videoUrl: 'https://youtu.be/8YHsxXEVB1M?si=bhkyDUJwN1A2RL_-', duration: '3:05 mins', thumbnail: 'https://i.ibb.co/d0JHb3Rw/Rectangle-280-8.png' },
  { bookId: 14, subject: 'Chemistry', grade: 'Second year of secondary school (Scientific)', title: 'Electrolysis', description: 'Chemistry - Second year Scientific', videoUrl: 'https://youtu.be/7uIIq_Ofzgw?si=inb3hRw5fbSr9lep', duration: '5:11 mins', thumbnail: 'https://i.ibb.co/NXJwWYz/Rectangle-285-12.png' },
  // bookId 15 - Biology Second year Scientific
  { bookId: 15, subject: 'Biology', grade: 'Second year of secondary school (Scientific)', title: 'Nucleic Acids', description: 'Biology - Second year Scientific', videoUrl: 'https://youtu.be/SeOrvA9ikW8?si=ZqfM9gLoAaVINdsI', duration: '6:16 mins', thumbnail: 'https://i.ibb.co/39wvsmPv/Rectangle-276-9.png' },
  { bookId: 15, subject: 'Biology', grade: 'Second year of secondary school (Scientific)', title: 'Carbohydrates', description: 'Biology - Second year Scientific', videoUrl: 'https://youtu.be/rQyWJIn1HYE?si=A1kXNppTQzWhPle5', duration: '5:34 mins', thumbnail: 'https://i.ibb.co/bjxqz5G5/Rectangle-289.png' },
  { bookId: 15, subject: 'Biology', grade: 'Second year of secondary school (Scientific)', title: 'Proteins', description: 'Biology - Second year Scientific', videoUrl: 'https://youtu.be/JGZj6DsUZhE?si=tvKJVBW0t2voqKe1', duration: '4:18 mins', thumbnail: 'https://i.ibb.co/8gkfYNjd/Rectangle-285-13.png' },
  // bookId 16 - Math Second year Scientific
  { bookId: 16, subject: 'Math', grade: 'Second year of secondary school (Scientific)', title: 'Multiplication Table', description: 'Math - Second year Scientific', videoUrl: 'https://youtube.com/watch?v=uup7IC7c1V8&feature=shared', duration: '2:33 mins', thumbnail: 'https://i.ibb.co/RTGDGDgD/Rectangle-276-10.png' },
  { bookId: 16, subject: 'Math', grade: 'Second year of secondary school (Scientific)', title: 'Mathematical Equations', description: 'Math - Second year Scientific', videoUrl: 'https://youtube.com/watch?v=Z-ZkmpQBIFo&feature=shared', duration: '25:05 mins', thumbnail: 'https://i.ibb.co/JRbMTpSv/Rectangle-280-9.png' },
  { bookId: 16, subject: 'Math', grade: 'Second year of secondary school (Scientific)', title: 'Mathematical Proof', description: 'Math - Second year Scientific', videoUrl: 'https://youtu.be/YYgepDY3rHw?si=qmBfX04fefzbck8O', duration: '9:41 mins', thumbnail: 'https://i.ibb.co/F4qj5Bk1/Rectangle-285-14.png' },
  // bookId 17 - Physics Second year Scientific
  { bookId: 17, subject: 'Physics', grade: 'Second year of secondary school (Scientific)', title: 'Vector Quantities', description: 'Physics - Second year Scientific', videoUrl: 'https://youtu.be/rTJ-hW2TVwE?si=NO3gEPzHCds7XUyP', duration: '4:23 mins', thumbnail: 'https://i.ibb.co/Pv5TrsnC/Rectangle-276-11.png' },
  { bookId: 17, subject: 'Physics', grade: 'Second year of secondary school (Scientific)', title: 'Circular Motion', description: 'Physics - Second year Scientific', videoUrl: 'https://youtu.be/y2FmgoOht7Y?si=wncnlvuh1Y9wFgM2', duration: '15:36 mins', thumbnail: 'https://i.ibb.co/hR8nBYWM/Rectangle-280-10.png' },
  { bookId: 17, subject: 'Physics', grade: 'Second year of secondary school (Scientific)', title: 'The Nature Of Light', description: 'Physics - Second year Scientific', videoUrl: 'https://youtu.be/mlz_Gg-H6dE?si=e8UjzUIRC5XTz9OJ', duration: '4:22 mins', thumbnail: 'https://i.ibb.co/gMvDKqGJ/Rectangle-285-15.png' },
  // bookId 18 - History Third year Literary
  { bookId: 18, subject: 'History', grade: 'Third year of secondary school (Literary)', title: 'Frankish Wars', description: 'History - Third year Literary', videoUrl: 'https://youtu.be/H2hqa3AX5kY?si=wJJ-JW-b5BdhvV7i', duration: '14:19 mins', thumbnail: 'https://i.ibb.co/B5q1807L/Rectangle-276-5.png' },
  { bookId: 18, subject: 'History', grade: 'Third year of secondary school (Literary)', title: 'The First World War', description: 'History - Third year Literary', videoUrl: 'https://youtu.be/-GsolnXOiBg?si=MmaZmOC1II621dHt', duration: '5:20 mins', thumbnail: 'https://i.ibb.co/WNcm6HCH/Rectangle-280-5.png' },
  { bookId: 18, subject: 'History', grade: 'Third year of secondary school (Literary)', title: 'The Second World War', description: 'History - Third year Literary', videoUrl: 'https://youtu.be/hUDYd8LAvD8?si=lA1maiB4Hz8lid7j', duration: '28:25 mins', thumbnail: 'https://i.ibb.co/JR4NqDbZ/Rectangle-285-8.png' },
  // bookId 19 - Geography Third year Literary
  { bookId: 19, subject: 'Geography', grade: 'Third year of secondary school (Literary)', title: 'Energy Resources', description: 'Geography - Third year Literary', videoUrl: 'https://youtu.be/N5mHKqcit9I?si=tF-w7gYblObWns1A', duration: '3:51 mins', thumbnail: 'https://i.ibb.co/r24hTpcD/Rectangle-276-12.png' },
  { bookId: 19, subject: 'Geography', grade: 'Third year of secondary school (Literary)', title: 'Climate Disasters', description: 'Geography - Third year Literary', videoUrl: 'https://youtu.be/G9t__9Tmwv4?si=68h8LRWBShrAjqIB', duration: '5:56 mins', thumbnail: 'https://i.ibb.co/3yPL7yMB/Rectangle-280-11.png' },
  { bookId: 19, subject: 'Geography', grade: 'Third year of secondary school (Literary)', title: 'Geological Disasters', description: 'Geography - Third year Literary', videoUrl: 'https://youtu.be/cqCHtePMC8E?si=cjz9vlmcyPZeChNp', duration: '9:46 mins', thumbnail: 'https://i.ibb.co/CK60MP78/Rectangle-285-16.png' },
  // bookId 20 - English Third year Literary
  { bookId: 20, subject: 'English', grade: 'Third year of secondary school (Literary)', title: 'Future Continuous', description: 'English - Third year Literary', videoUrl: 'https://youtu.be/C0R9fbX2lfI?si=ubQiHn1ug5LGUx1-', duration: '6:44 mins', thumbnail: 'https://i.ibb.co/NhXrvTV/Rectangle-285-17.png' },
  { bookId: 20, subject: 'English', grade: 'Third year of secondary school (Literary)', title: 'Future Perfect', description: 'English - Third year Literary', videoUrl: 'https://youtu.be/RRCGlFNWbpk?si=DHt9yHIh23YB2nT0', duration: '8:11 mins', thumbnail: 'https://i.ibb.co/NhXrvTV/Rectangle-285-17.png' },
  { bookId: 20, subject: 'English', grade: 'Third year of secondary school (Literary)', title: 'Past Continuous', description: 'English - Third year Literary', videoUrl: 'https://youtu.be/rNeifsgIUxU?si=kKv4crscDIcG1No0', duration: '7:01 mins', thumbnail: 'https://i.ibb.co/NhXrvTV/Rectangle-285-17.png' },
  // bookId 21 - Arabic Third year Literary
  { bookId: 21, subject: 'Arabic', grade: 'Third year of secondary school (Literary)', title: 'Personal Pronouns', description: 'Arabic - Third year Literary', videoUrl: 'https://youtu.be/1_6-iVACkLA?si=fFSSzmpeEwwKmSyf', duration: '13:13 mins', thumbnail: 'https://i.ibb.co/nqVgJYpK/Rectangle-276-4.png' },
  { bookId: 21, subject: 'Arabic', grade: 'Third year of secondary school (Literary)', title: 'Demonstrative Names', description: 'Arabic - Third year Literary', videoUrl: 'https://youtu.be/eqpgVEgji64?si=pDNMQUM6eChg7Jel', duration: '5:13 mins', thumbnail: 'https://i.ibb.co/nqVgJYpK/Rectangle-276-4.png' },
  { bookId: 21, subject: 'Arabic', grade: 'Third year of secondary school (Literary)', title: 'Relative Pronouns', description: 'Arabic - Third year Literary', videoUrl: 'https://youtu.be/WkCSumtam0I?si=ekI3IsjT66rH0laD', duration: '4:00 mins', thumbnail: 'https://i.ibb.co/nqVgJYpK/Rectangle-276-4.png' },
  // bookId 22 - Biology Third year Scientific
  { bookId: 22, subject: 'Biology', grade: 'Third year of secondary school (Scientific)', title: 'Photosynthesis process', description: 'Biology - Third year Scientific', videoUrl: 'https://youtu.be/CMiPYHNNg28?si=eAkOpheI2-CU-4em', duration: '7:59 mins', thumbnail: 'https://i.ibb.co/x8mbBPDS/Rectangle-276-13.png' },
  { bookId: 22, subject: 'Biology', grade: 'Third year of secondary school (Scientific)', title: 'Cellular respiration', description: 'Biology - Third year Scientific', videoUrl: 'https://youtu.be/eJ9Zjc-jdys?si=o5s0c9zwfK7druzK', duration: '8:47 mins', thumbnail: 'https://i.ibb.co/pr35Cbsw/Rectangle-289-1.png' },
  { bookId: 22, subject: 'Biology', grade: 'Third year of secondary school (Scientific)', title: 'Aerobic respiration', description: 'Biology - Third year Scientific', videoUrl: 'https://youtu.be/ZkqEno1r2jk?si=O8SqCN7GgdcU5iQ5', duration: '2:53 mins', thumbnail: 'https://i.ibb.co/VWx7rBLX/Rectangle-285-18.png' },
  // bookId 23 - Math Third year Scientific
  { bookId: 23, subject: 'Math', grade: 'Third year of secondary school (Scientific)', title: 'Average Change', description: 'Math - Third year Scientific', videoUrl: 'https://youtu.be/lQRiw264bnI?si=29KcDH8emzURoRYs', duration: '4:43 mins', thumbnail: 'https://i.ibb.co/twP2MWXd/Rectangle-276-14.png' },
  { bookId: 23, subject: 'Math', grade: 'Third year of secondary school (Scientific)', title: 'Matrices', description: 'Math - Third year Scientific', videoUrl: 'https://youtu.be/yRwQ7A6jVLk?si=lODk8kbhFlsYl0Sv', duration: '11:23 mins', thumbnail: 'https://i.ibb.co/DDqsYTJg/Rectangle-280-12.png' },
  { bookId: 23, subject: 'Math', grade: 'Third year of secondary school (Scientific)', title: 'Extreme Values', description: 'Math - Third year Scientific', videoUrl: 'https://youtu.be/Sx2lPZlnWfs?si=M0kZhw3UUQL3xA6O', duration: '6:04 mins', thumbnail: 'https://i.ibb.co/hF0cFhJV/Rectangle-285-19.png' },
  // bookId 24 - Physics Third year Scientific
  { bookId: 24, subject: 'Physics', grade: 'Third year of secondary school (Scientific)', title: 'Linear Momentum', description: 'Physics - Third year Scientific', videoUrl: 'https://youtu.be/SP2hy3Uf0Ls?si=rYEMNxv0wv8d9WWG', duration: '19:37 mins', thumbnail: 'https://i.ibb.co/27RQtgn1/Rectangle-276-15.png' },
  { bookId: 24, subject: 'Physics', grade: 'Third year of secondary school (Scientific)', title: 'Average Thrust Force', description: 'Physics - Third year Scientific', videoUrl: 'https://youtu.be/YJzilDa2WDs?si=lMOhm5X1vNvZRhed', duration: '2:33 mins', thumbnail: 'https://i.ibb.co/2Vw0K88/Rectangle-280-13.png' },
  { bookId: 24, subject: 'Physics', grade: 'Third year of secondary school (Scientific)', title: 'Collisions', description: 'Physics - Third year Scientific', videoUrl: 'https://youtu.be/CFbo_nBdBco?si=Fa6tMcAkv76KxLdW', duration: '11:23 mins', thumbnail: 'https://i.ibb.co/ycgfd2vt/Rectangle-285-20.png' },
  // bookId 25 - Chemistry Third year Scientific
  { bookId: 25, subject: 'Chemistry', grade: 'Third year of secondary school (Scientific)', title: 'Periodic Table', description: 'Chemistry - Third year Scientific', videoUrl: 'https://youtu.be/CMiPYHNNg28?si=eAkOpheI2-CU-4em', duration: '7:53 mins', thumbnail: 'https://i.ibb.co/chsWKmfb/Rectangle-276-16.png' },
  { bookId: 25, subject: 'Chemistry', grade: 'Third year of secondary school (Scientific)', title: 'Atomic Number', description: 'Chemistry - Third year Scientific', videoUrl: 'https://youtu.be/eJ9Zjc-jdys?si=o5s0c9zwfK7druzK', duration: '3:23 mins', thumbnail: 'https://i.ibb.co/Y7jcNHt9/Rectangle-280-14.png' },
  { bookId: 25, subject: 'Chemistry', grade: 'Third year of secondary school (Scientific)', title: 'Mass Number', description: 'Chemistry - Third year Scientific', videoUrl: 'https://youtu.be/ZkqEno1r2jk?si=O8SqCN7GgdcU5iQ5', duration: '2:41 mins', thumbnail: 'https://i.ibb.co/4Z4kJKKs/Rectangle-285-21.png' },
  // bookId 26 - Arabic Second year Literary
  { bookId: 26, subject: 'Arabic', grade: 'Second year of secondary school (Literary)', title: 'Adverb Of Place', description: 'Arabic - Second year Literary', videoUrl: 'https://youtu.be/B8bVZRhu950?si=yzcLQvvoiQz7ixaf', duration: '4:55 mins', thumbnail: 'https://i.ibb.co/nqVgJYpK/Rectangle-276-4.png' },
  { bookId: 26, subject: 'Arabic', grade: 'Second year of secondary school (Literary)', title: 'Adverb Of Time', description: 'Arabic - Second year Literary', videoUrl: 'https://youtu.be/gwT_PhSgh78?si=3U4WiBk_CKndlHqs', duration: '3:30 mins', thumbnail: 'https://i.ibb.co/1JpYyWrF/Rectangle-280-4.png' },
  { bookId: 26, subject: 'Arabic', grade: 'Second year of secondary school (Literary)', title: 'Genitive Case', description: 'Arabic - Second year Literary', videoUrl: 'https://youtu.be/9eiw7yDTBI8?si=5VndZnBX9HwGfs5j', duration: '11:56 mins', thumbnail: 'https://i.ibb.co/xK1jDXZv/Rectangle-285-7.png' },
];

const seedDB = async () => {
  try {
    await connectDB();
    await Course.deleteMany({});
    await Lesson.deleteMany({});
    console.log('Old data deleted');

    const formattedCourses = courses.map((c) => ({
      _id: new mongoose.Types.ObjectId('000000000000000000000' + c._id.slice(-3).padStart(3, '0')),
      title: c.title,
      description: c.description,
      category: c.category,
      thumbnail: c.thumbnail,
      level: c.level,
      price: 0,
      isPublished: true,
      instructor: new mongoose.Types.ObjectId(INSTRUCTOR_ID),
    }));

    await Course.insertMany(formattedCourses);
    console.log(`✅ ${formattedCourses.length} courses inserted`);

    const formattedLessons = lessons.map((l, i) => ({
      title: l.title,
      description: l.description,
      subject: l.subject,
      grade: l.grade,
      videoUrl: l.videoUrl,
      duration: l.duration,
      thumbnail: l.thumbnail,
      course: new mongoose.Types.ObjectId('000000000000000000000' + String(l.bookId).padStart(3, '0')),
      order: i,
    }));

    await Lesson.insertMany(formattedLessons);
    console.log(`✅ ${formattedLessons.length} lessons inserted`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding:', err);
    process.exit(1);
  }
};

seedDB();