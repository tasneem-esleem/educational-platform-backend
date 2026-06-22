const asyncHandler = require('express-async-handler');
const Message = require('../models/Message');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const mongoose = require('mongoose'); 
const sendResponse = require('../utils/sendResponse');

const getMessages = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const messages = await Message.find({
    $or: [
      { sender: req.user._id, receiver: userId },
      { sender: userId, receiver: req.user._id },
    ],
  }).sort({ createdAt: 1 });

  return sendResponse(res, 200, messages);
});

const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, content } = req.body;
  if (!receiverId || !content) throw new AppError('Receiver ID and content are required', 400);

  const message = await Message.create({
    sender: req.user._id,
    receiver: receiverId,
    content,
  });

  return sendResponse(res, 201, message, 'Message sent successfully');
});

const getChatUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } }).select('name avatar role');
  return sendResponse(res, 200, users);
});

const getConversations = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user._id);

  const conversations = await Message.aggregate([
    { $match: { $or: [{ sender: userId }, { receiver: userId }] } },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: { $cond: [{ $eq: ["$sender", userId] }, "$receiver", "$sender"] },
        lastMessage: { $first: "$content" },
        lastTime: { $first: "$createdAt" }
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "contact"
      }
    },
    { $unwind: "$contact" },
    {
      $project: {
        chatId: "$_id",
        contact: { name: "$contact.name", avatar: "$contact.avatar" },
        lastMessage: 1,
        lastTime: 1
      }
    }
  ]);

  return sendResponse(res, 200, conversations);
});

module.exports = { getMessages, sendMessage, getChatUsers, getConversations };
