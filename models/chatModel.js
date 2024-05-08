const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  message: { type: String, required: [true, 'A message is required'] },
  sender: {
    type: mongoose.SchemaTypes.ObjectId,
  },
  userID1: {
    type: mongoose.SchemaTypes.ObjectId,
  },
  userID2: {
    type: mongoose.SchemaTypes.ObjectId,
  },
  time: Date,
});

const Chat = mongoose.model('chats', chatSchema);

module.exports = Chat;
