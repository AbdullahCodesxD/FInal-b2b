const mongoose = require('mongoose');

const supportSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is require'],
    minLength: [5, 'Title must have 5 characters'],
    maxLength: [50, 'Title cannot exceed 50 characters'],
  },

  description: {
    type: String,
    required: [true, 'Description is required'],
    minLength: [50, 'Description must have at least 50 characters'],
    maxLength: [300, 'Description length cannot exceed 300 characters'],
  },
  date: Date,
  status: {
    type: String,
    default: 'ative',
  },
  media: [String],
  ticketNo: {
    type: Number,
    unique: [true, 'Something went wrong try again'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'users',
  },
});

const Support = mongoose.model('support', supportSchema);

module.exports = Support;
