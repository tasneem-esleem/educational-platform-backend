const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const cloudinary = require('../config/cloudinary');
const sendResponse = require('../utils/sendResponse');

const generateAuthResponse = (user) => {
  const token = user.generateToken();
  return { user, token };
};

const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, name, email, password, role } = req.body;
  const fullName = name || `${firstName || ''} ${lastName || ''}`.trim();
  if (!fullName) throw new AppError('Name is required', 400);
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new AppError('An account with this email already exists', 409);
  const user = await User.create({
    name: fullName,
    email,
    password,
    role: role || 'student',
  });
  const { user: newUser, token } = generateAuthResponse(user);
  return sendResponse(res, 201, { user: newUser, token }, 'Registered successfully');
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }
  user.lastLogin = Date.now();
  await user.save({ validateBeforeSave: false });
  const { user: loggedUser, token } = generateAuthResponse(user);
  return sendResponse(res, 200, { user: loggedUser, token }, 'Login successful');
});

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('enrolledCourses', 'title thumbnail category')
    .populate('createdCourses', 'title thumbnail category isPublished');

  if (!user) throw new AppError('User not found', 404);

  return sendResponse(res, 200, user);
});

const updateMe = asyncHandler(async (req, res) => {
  const allowedFields = ['name', 'bio', 'dateOfBirth', 'gender', 'contactNumber', 'address', 'city', 'country'];
  const updates = {};
  Object.keys(req.body).forEach((key) => {
    if (allowedFields.includes(key)) updates[key] = req.body[key];
  });
  if (req.file) {
    updates.avatar = req.file.path;
  }
  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });
  if (!user) throw new AppError('User not found', 404);
  return sendResponse(res, 200, user, 'Profile updated successfully');
});

const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, oldPassword } = req.body;
  const current = currentPassword || oldPassword;
  if (!current || !newPassword) throw new AppError('Passwords are required', 400);
  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(current))) throw new AppError('Current password is incorrect', 401);
  user.password = newPassword;
  await user.save();
  return sendResponse(res, 200, null, 'Password updated successfully');
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new AppError('No account with this email', 404);
  const otp = Math.floor(10000 + Math.random() * 90000).toString();
  user.otpCode = await bcrypt.hash(otp, 10);
  user.otpExpires = Date.now() + 10 * 60 * 1000;
  await user.save({ validateBeforeSave: false });
  console.log(`OTP Code for ${email}: ${otp}`);
  return sendResponse(res, 200, null, 'OTP sent successfully');
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  const isValidOtp = user?.otpCode && await bcrypt.compare(otp, user.otpCode);
  if (!user || !isValidOtp || user.otpExpires < Date.now()) {
    throw new AppError('Invalid or expired OTP', 400);
  }
  user.otpCode = null;
  user.otpExpires = null;
  user.otpVerified = true;
  await user.save({ validateBeforeSave: false });
  return sendResponse(res, 200, null, 'OTP verified successfully');
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword, new_password } = req.body;
  const finalPassword = newPassword || new_password;
  const user = await User.findOne({ email });
  if (!user) throw new AppError('User not found', 404);
  if (!user.otpVerified) {
    throw new AppError('OTP verification required', 403);
  }
  user.password = finalPassword;
  user.otpVerified = false;
  await user.save();
  return sendResponse(res, 200, null, 'Password reset successful');
});

const googleCallback = asyncHandler(async (req, res) => {
  if (!req.user) {
    console.warn('Google OAuth: req.user مفقود في googleCallback.');
    return res.redirect(`${process.env.CLIENT_URL}/login?error=google_auth_failed`);
  }

  const token = req.user.generateToken();
  req.user.lastLogin = Date.now();
  await req.user.save({ validateBeforeSave: false });

  res.redirect(`${process.env.CLIENT_URL}/oauth-callback?token=${token}`);
});

module.exports = {
  register,
  login,
  getMe,
  updateMe,
  updatePassword,
  forgotPassword,
  verifyOtp,
  resetPassword,
  googleCallback
};
