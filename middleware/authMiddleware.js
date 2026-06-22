const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const AppError = require('../utils/AppError');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('Not authorized, no token provided', 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new AppError('Not authorized, token failed or expired', 401);
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new AppError('The user belonging to this token no longer exists', 401);
  }

  if (!user.isActive) {
    throw new AppError('This account has been deactivated', 403);
  }

  req.user = user;
  next();
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError('You do not have permission to perform this action', 403);
    }
    next();
  };
};

module.exports = { protect, restrictTo };
