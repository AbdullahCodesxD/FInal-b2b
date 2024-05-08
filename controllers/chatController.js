const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Models
const User = require('../models/userModel');
const Chat = require('../models/chatModel');

//////////////////////////
///////Send A message
//////////////////////////
exports.sendMessage = catchAsync(async function (req, res, next) {
  const message = req.body.message;
  const userID1 = req.user._id;
  const userID2 = req.body.receiver;
  const sentMessage = await Chat.create({
    message,
    userID1,
    userID2,
    sender: userID1,
    time: Date.now(),
  });

  const user = await User.findById(userID1).select('messageSent');
  const user2 = await User.findById(userID2).select('messageSent');

  if (user.messageSent.indexOf(String(userID2)) === -1) {
    await User.findByIdAndUpdate(userID1, {
      messageSent: [...user.messageSent, userID2],
    });
    await User.findByIdAndUpdate(userID2, {
      messageSent: [...user2.messageSent, userID1],
    });
  }

  res.status(201).json({
    message: 'success',
    sentMessage,
  });
});

//////////////////////////
///////Get All message
//////////////////////////
exports.getAllMessages = catchAsync(async function (req, res, next) {
  const loggedIn = req.user._id;
  const otherUser = req.params.id;

  const user = await User.findById(otherUser);

  const allMessages = await Chat.find({
    $or: [
      { userID1: user._id, userID2: loggedIn },
      { userID1: loggedIn, userID2: user._id },
    ],
  }).sort({ time: -1 });

  res.status(200).json({
    message: 'success',
    noOfMessages: allMessages.length,
    allMessages,
    user,
    loggedIn,
  });
});
//////////////////////////
///////Get User
//////////////////////////
exports.getUsers = catchAsync(async function (req, res, next) {
  const user = req.user;

  const allUsers = await User.findById(user._id)
    .select('messageSent -_id')
    .populate('messageSent');

  res.status(200).json({
    message: 'success',
    noOfUsers: allUsers.messageSent.length,
    data: allUsers.messageSent,
  });
});
