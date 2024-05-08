const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const chatController = require('../controllers/chatController');

router.post('/', authController.protect, chatController.sendMessage);
router.get(
  '/messages/:id',
  authController.protect,
  chatController.getAllMessages,
);
router.get('/users', authController.protect, chatController.getUsers);

module.exports = router;
