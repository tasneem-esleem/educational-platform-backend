const express = require('express');
const {
  register,
  login,
  getMe,
  updateMe,
  updatePassword,
  forgotPassword,
  verifyOtp,
  resetPassword,
  googleCallback,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validate, registerValidationRules, loginValidationRules } = require('../middleware/validators');
const passport = require('../config/passport');
const upload = require('../middleware/upload');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many attempts, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', registerValidationRules, validate, register);
router.post('/login', authLimiter, loginValidationRules, validate, login);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/verify-otp', authLimiter, verifyOtp);
router.post('/resend-otp', authLimiter, forgotPassword);
router.post('/reset-password', resetPassword);

router.get(
  '/me',
  (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  },
  protect,
  getMe
);
router.patch('/me', protect, upload.single('avatar'), updateMe);
router.patch('/update-password', protect, updatePassword);

/* =========================
   GOOGLE OAUTH
========================= */

// ✅ FIX: نتحقق من passport.isGoogleConfigured (المحسوبة مرة وحدة وقت
// تحميل config/passport.js) بدل التحقق المباشر من process.env هون.
// لو الـ strategy مش مسجلة أصلاً، استدعاء passport.authenticate('google', ...)
// كان رح يرمي خطأ "Unknown authentication strategy 'google'" — فهلق
// منمنع الاستدعاء بالكامل ومنعمل redirect واضح بدل هيك.
router.get('/google', (req, res, next) => {
  if (!passport.isGoogleConfigured) {
    return res.redirect(
      `${process.env.CLIENT_URL}/login?error=google_not_configured`
    );
  }
  return passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  if (!passport.isGoogleConfigured) {
    return res.redirect(`${process.env.CLIENT_URL}/login?error=google_not_configured`);
  }

  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err) {
      console.error('Google OAuth error:', err.message);
      return res.redirect(`${process.env.CLIENT_URL}/login?error=google_auth_failed`);
    }
    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=google_auth_failed`);
    }
    req.user = user;
    next();
  })(req, res, next);
}, googleCallback);

module.exports = router;
