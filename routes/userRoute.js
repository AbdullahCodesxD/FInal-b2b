const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const reviewRouter = require('./reviewRoute');
const supportRouter = require('./supportRoute');

// Authorization actions
router.post('/signup', authController.createUser);
router.post('/login', authController.login);
router.get('/logout', authController.protect, authController.logout);

router.post(
  '/image',
  authController.protect,
  userController.uploadImages,
  userController.uploadImage,
);
// User Actions
router.patch(
  '/changePassword',
  authController.protect,
  authController.updatePassword,
);
router.patch('/updateMe', authController.protect, userController.updateUser);
router.get('/me', authController.protect, userController.userDetails);
router.get('/users/:id', authController.protect, userController.getAUser);
// Product actions for user

router.use('/:productId/reviews', reviewRouter);
router.use('/support', supportRouter);

// Admin Actions
router.get('/', userController.getAllUsers);
module.exports = router;
