// const asyncHandler = require('express-async-handler');
// const User = require('../models/User');
// const Course = require('../models/Course');
// const AppError = require('../utils/AppError');
// const sendResponse = require('../utils/sendResponse');

// const getAllUsers = asyncHandler(async (req, res) => {
//   const { role } = req.query;

//   const filter = {};
//   if (role) filter.role = role;

//   const users = await User.find(filter).sort('-createdAt');

//   return sendResponse(res, 200, users, null, { count: users.length });
// });

// const getUser = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.params.id);

//   if (!user) {
//     throw new AppError('User not found', 404);
//   }

//   return sendResponse(res, 200, user);
// });

// const updateUserRole = asyncHandler(async (req, res) => {
//   const { role } = req.body;
//   const validRoles = ['student', 'instructor', 'admin'];

//   if (!validRoles.includes(role)) {
//     throw new AppError('Invalid role specified', 400);
//   }

//   const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true, runValidators: true });

//   if (!user) {
//     throw new AppError('User not found', 404);
//   }

//   return sendResponse(res, 200, user, 'User role updated successfully');
// });

// const toggleUserStatus = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.params.id);

//   if (!user) {
//     throw new AppError('User not found', 404);
//   }

//   user.isActive = !user.isActive;
//   await user.save({ validateBeforeSave: false });

//   return sendResponse(res, 200, user, `User account ${user.isActive ? 'activated' : 'deactivated'} successfully`);
// });

// const deleteUser = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.params.id);

//   if (!user) {
//     throw new AppError('User not found', 404);
//   }

//   await user.deleteOne();

//   return sendResponse(res, 200, null, 'User deleted successfully');
// });

// const getDashboardStats = asyncHandler(async (req, res) => {
//   const [totalUsers, totalStudents, totalInstructors, totalCourses, publishedCourses] = await Promise.all([
//     User.countDocuments(),
//     User.countDocuments({ role: 'student' }),
//     User.countDocuments({ role: 'instructor' }),
//     Course.countDocuments(),
//     Course.countDocuments({ isPublished: true }),
//   ]);

//   const stats = {
//     totalUsers,
//     totalStudents,
//     totalInstructors,
//     totalCourses,
//     publishedCourses,
//   };

//   return sendResponse(res, 200, stats);
// });

// module.exports = {
//   getAllUsers,
//   getUser,
//   updateUserRole,
//   toggleUserStatus,
//   deleteUser,
//   getDashboardStats,
// };
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Course = require('../models/Course');
const AppError = require('../utils/AppError');
const sendResponse = require('../utils/sendResponse');

// GET ALL USERS (with filter)
const getAllUsers = asyncHandler(async (req, res) => {
  const { role, page = 1, limit = 10 } = req.query;

  const filter = {};
  if (role) filter.role = role;

  const skip = (page - 1) * limit;

  const users = await User.find(filter)
    .select('-password')
    .sort('-createdAt')
    .skip(skip)
    .limit(Number(limit));

  const total = await User.countDocuments(filter);

  return sendResponse(
    res,
    200,
    {
      users,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    },
    "Users fetched successfully"
  );
});

// GET SINGLE USER
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return sendResponse(res, 200, user, "User fetched successfully");
});

// UPDATE ROLE
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  // unified roles (IMPORTANT FIX)
  const validRoles = ['student', 'teacher', 'admin'];

  if (!validRoles.includes(role)) {
    throw new AppError('Invalid role specified', 400);
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return sendResponse(res, 200, user, 'User role updated successfully');
});

// TOGGLE STATUS
const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  user.isActive = !user.isActive;
  await user.save({ validateBeforeSave: false });

  return sendResponse(
    res,
    200,
    user,
    `User account ${user.isActive ? 'activated' : 'deactivated'} successfully`
  );
});

// DELETE USER
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  await user.deleteOne();

  return sendResponse(res, 200, null, 'User deleted successfully');
});

// DASHBOARD STATS
const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalStudents, totalTeachers, totalCourses, publishedCourses] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'teacher' }),
      Course.countDocuments(),
      Course.countDocuments({ isPublished: true }),
    ]);

  return sendResponse(
    res,
    200,
    {
      totalUsers,
      totalStudents,
      totalTeachers,
      totalCourses,
      publishedCourses,
    },
    "Dashboard stats fetched successfully"
  );
});

module.exports = {
  getAllUsers,
  getUser,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  getDashboardStats,
};