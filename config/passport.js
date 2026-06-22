const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const User = require('../models/User');
const GOOGLE_CALLBACK_URL =
  process.env.GOOGLE_CALLBACK_URL ||
  `${process.env.SERVER_URL || 'http://localhost:5000'}/api/auth/google/callback`;
const isGoogleConfigured = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);

if (!isGoogleConfigured) {
  console.warn(
    '⚠️  GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET غير معرّفين — تسجيل ' +
    'الدخول عبر جوجل سيكون معطّلاً، لكن باقي السيرفر سيعمل بشكل طبيعي.'
  );
} else {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('Google account has no public email'), null);
          }

          let user = await User.findOne({ email });

          if (!user) {
            user = await User.create({
              name: profile.displayName,
              email,
              avatar: profile.photos?.[0]?.value || '',
              password: require('crypto').randomBytes(32).toString('hex'),
              role: 'student',
              authProvider: 'google',
            });
          } else if (!user.avatar && profile.photos?.[0]?.value) {
            user.avatar = profile.photos[0].value;
            await user.save({ validateBeforeSave: false });
          }

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
}

module.exports = passport;
module.exports.isGoogleConfigured = isGoogleConfigured;
