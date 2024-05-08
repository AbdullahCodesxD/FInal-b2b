const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

///////////////////////////////////////////
// Generate JWT
///////////////////////////////////////////
const getJWT = function (id) {
  const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

///////////////////////////////////////////
// Create User
///////////////////////////////////////////
exports.createUser = catchAsync(async function (req, res, next) {
  const { name, lastName, email, password, confirmPassword, country, region } =
    req.body;

  const newUser = await User.create({
    name,
    lastName,
    email,
    password,
    confirmPassword,
    country: country?.toLowerCase(),
    region: region?.toLowerCase(),
  });
  // Create JWT TOKEN FOR LOGIN FUNCTIONALITY
  const token = getJWT(newUser._id);

  res.cookie('jwt', token, {
    expiresIn: Date.now() + 90 * 24 * 60 * 60,
  });

  // SETTING NEW USER
  req.user = newUser;
  res.status(201).json({
    message: 'Success',
    token,
  });
});
///////////////////////////////////////////
// Protect user
///////////////////////////////////////////
exports.protect = catchAsync(async function (req, res, next) {
  let token;
  const bearer =
    req.headers.authorization?.startsWith('Bearer') &&
    req.headers.authorization?.split(' ')[1];
  if (bearer) token = bearer;
  else if (req.cookies.jwt) token = req.cookies.jwt;
  else return next(new AppError('You need to login first', 403));

  const userID = jwt.decode(token)?.id;
  const user = await User.findOne({ _id: userID }).select('+role');

  if (!user) next(new AppError('You need to login first', 403));

  // If user is found and the user is logged in then setting
  // user on res property to use in the next middleware
  req.user = user;

  // Going in the next middleware
  next();
});
///////////////////////////////////////////
// Check type of user
///////////////////////////////////////////
exports.checkUserRole = (role) => {
  return function (req, res, next) {
    if (role !== req.user.role)
      next(new AppError('You cannot perform this action', 403));

    next();
  };
};

///////////////////////////////////////////
// Update user password
///////////////////////////////////////////
exports.updatePassword = catchAsync(async function (req, res, next) {
  const { currentPassword, password, confirmPassword } = req.body;
  if (!currentPassword || !password || !confirmPassword)
    return next(
      new AppError(
        'Please provide current password, New Password and Confirm Password',
        401,
      ),
    );

  // Selecting current users passsword
  const currentUser = await User.findById(req.user._id).select('+password');
  // Checking if given password matches orignal one
  const currentPasswordMatchesOrignalPassword = await currentUser.checkPassword(
    currentPassword,
    currentUser.password,
  );
  // If password does not match throw err
  if (!currentPasswordMatchesOrignalPassword)
    return next(
      new AppError('Current Password does not match orignal password', 401),
    );

  currentUser.password = password;
  currentUser.confirmPassword = confirmPassword;
  currentUser.passwordChangedAt = Date.now();
  await currentUser.save();

  res.status(201).json({
    status: 'success',
    message: 'Password Changed Successfully',
  });
});
///////////////////////////////////////////
// Login User
///////////////////////////////////////////
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // If no email and password throw error
  if (!email || !password)
    return next(new AppError('Please provide email and password.', 403));

  // Password and user
  const user = await User.findOne({ email }).select('+password +role +_id');

  // no user throw new err
  // Password dont match throw new error
  if (!user || !(await user.checkPassword(password, user.password)))
    return next(new AppError('Invalid email or password. Try again', 403));

  const token = getJWT(user._id);

  res.cookie('jwt', token, {
    expiresIn: Date.now() + 90 * 24 * 60 * 60,
  });

  req.user = user;

  res.status(200).json({
    message: 'success',
    token,
    role: user.role,
  });
});
///////////////////////////////////////////
// Logout User
///////////////////////////////////////////
exports.logout = catchAsync(async (req, res, next) => {
  res.cookie('jwt', '');
  res.status(200).json({
    status: 'success',
    token: '',
  });
});
