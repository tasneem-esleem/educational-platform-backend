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
const { defaultClientUrl, resolveClientOrigin } = require('../utils/clientOrigins');

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
//
// ✅ FIX (الجذري): قبل هيك كان السيرفر دايماً بيرجّع المستخدم بعد تسجيل
// الدخول عبر Google على process.env.CLIENT_URL بشكل ثابت — يعني لو كنت
// عم تجرب الموقع من نسختك المحلية (localhost:3000) وضغطت "Login with
// Google"، السيرفر كان يرجّعك على نسخة الإنتاج على Vercel بدل ما يرجّعك
// على لوكال هوست! وهذا بالضبط سبب اختفاء الكتب/الدروس/الواجبات بعد
// تسجيل الدخول بجوجل: إنت فعلياً ما عدت عم تتصفح نسختك المحلية.
//
// هلق منحفظ "من وين بدأ الطلب" (origin/referer) بمتغير state قبل ما
// نروح على Google، وبعد ما يرجع الكولباك منرجّع المستخدم لنفس المكان
// يلي بدأ منه (إذا كان من ضمن الروابط المسموحة CLIENT_URLS).
router.get('/google', (req, res, next) => {
  if (!passport.isGoogleConfigured) {
    return res.redirect(
      `${defaultClientUrl}/login?error=google_not_configured`
    );
  }

  const candidateOrigin = req.get('origin') || req.get('referer');
  const resolvedOrigin = resolveClientOrigin(candidateOrigin);

  return passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
    state: encodeURIComponent(resolvedOrigin),
  })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  // الرابط يلي لازم نرجّع المستخدم عليه = نفس الموقع يلي بدأ منه تسجيل
  // الدخول (محفوظ بـ state)، أو الرابط الافتراضي لو مفيش state لأي سبب.
  const clientUrl = resolveClientOrigin(
    req.query.state ? decodeURIComponent(req.query.state) : null
  );

  if (!passport.isGoogleConfigured) {
    return res.redirect(`${clientUrl}/login?error=google_not_configured`);
  }

  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err) {
      console.error('Google OAuth error:', err.message);
      return res.redirect(`${clientUrl}/login?error=google_auth_failed`);
    }
    if (!user) {
      return res.redirect(`${clientUrl}/login?error=google_auth_failed`);
    }
    req.user = user;
    req.clientUrl = clientUrl;
    next();
  })(req, res, next);
}, googleCallback);

module.exports = router;
