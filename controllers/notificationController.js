// const asyncHandler = require('express-async-handler');
// const Notification = require('../models/Notification');
// const AppError = require('../utils/AppError');
// const sendResponse = require('../utils/sendResponse');

// const getNotifications = asyncHandler(async (req, res) => {
//   const notifications = await Notification.find({ recipient: req.user._id })
//     .sort({ createdAt: -1 });

//   return sendResponse(res, 200, notifications, null, { results: notifications.length });
// });

// const markAsRead = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   const notification = await Notification.findOneAndUpdate(
//     { _id: id, recipient: req.user._id },
//     { isRead: true },
//     { new: true }
//   );

//   if (!notification) {
//     throw new AppError('Notification not found or unauthorized', 404);
//   }

//   return sendResponse(res, 200, notification, 'Notification marked as read');
// });

// const markAllAsRead = asyncHandler(async (req, res) => {
//   await Notification.updateMany(
//     { recipient: req.user._id, isRead: false },
//     { isRead: true }
//   );

//   return sendResponse(res, 200, null, 'All notifications marked as read');
// });

// module.exports = { getNotifications, markAsRead, markAllAsRead };

const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');
const AppError = require('../utils/AppError');
const sendResponse = require('../utils/sendResponse');

// GET NOTIFICATIONS
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .sort({ createdAt: -1 });

  return sendResponse(
    res,
    200,
    {
      notifications,
      count: notifications.length,
    },
    "Notifications fetched successfully"
  );
});

// MARK ONE AS READ
const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notification = await Notification.findOneAndUpdate(
    { _id: id, recipient: req.user._id },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    throw new AppError('Notification not found or unauthorized', 404);
  }

  return sendResponse(
    res,
    200,
    notification,
    "Notification marked as read"
  );
});

// MARK ALL AS READ
const markAllAsRead = asyncHandler(async (req, res) => {
  const result = await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { isRead: true }
  );

  return sendResponse(
    res,
    200,
    {
      modifiedCount: result.modifiedCount,
    },
    "All notifications marked as read"
  );
});

module.exports = { getNotifications, markAsRead, markAllAsRead };