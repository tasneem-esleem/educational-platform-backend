require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');
const notFound = require('./middleware/notFoundMiddleware');

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const quizRoutes = require('./routes/quizRoutes');
const adminRoutes = require('./routes/adminRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const bookRoutes = require('./routes/bookRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const contactRoutes = require('./routes/contactRoutes');

const passport = require('./config/passport');

connectDB();

const app = express();
app.set('trust proxy', 1);

/* =========================
   SECURITY MIDDLEWARE
========================= */
app.use(helmet());

// ✅ FIX: بدل قائمة ثابتة فيها origin واحد بس + لوكال هوست، هلق منستخدم
// helper بيدعم أكتر من رابط بنفس الوقت (Production على Vercel + لوكال
// هوست أثناء التطوير) عن طريق CLIENT_URLS (مفصولة بفاصلة) أو CLIENT_URL.
const { allowedOrigins } = require('./utils/clientOrigins');

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`🚫 CORS blocked request from origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

/* =========================
   BODY PARSER
========================= */
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

/* =========================
   LOGGING
========================= */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/* =========================
   RATE LIMITING (GLOBAL)
========================= */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
});

app.use('/api', globalLimiter);

/* =========================
   HEALTH CHECK
========================= */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is up and running',
    timestamp: new Date().toISOString(),
  });
});

/* =========================
   PASSPORT
========================= */
app.use(passport.initialize());

/* =========================
   ROUTES (API v1 READY)
========================= */
const API_PREFIX = '/api';

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/courses`, courseRoutes);
app.use(`${API_PREFIX}/quizzes`, quizRoutes);
app.use(`${API_PREFIX}/admin`, adminRoutes);
app.use(`${API_PREFIX}/assignments`, assignmentRoutes);
app.use(`${API_PREFIX}/messages`, messageRoutes);
app.use(`${API_PREFIX}/notifications`, notificationRoutes);
app.use(`${API_PREFIX}/books`, bookRoutes);
app.use(`${API_PREFIX}/lessons`, lessonRoutes);
app.use(`${API_PREFIX}`, contactRoutes);

/* =========================
   ERROR HANDLING
========================= */
app.use(notFound);
app.use(errorHandler);

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
  );
});

/* =========================
   UNHANDLED ERRORS
========================= */
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});