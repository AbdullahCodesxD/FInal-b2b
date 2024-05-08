const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'A review must have a rating'],
    },
    review: String,

    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'products',
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'users',
    },
  },
  {
    toJson: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);

reviewSchema.pre(/^find/, function (next) {
  // this.populate('user').populate('product', {

  // });
  this.populate('user', 'name -_id').populate('product', 'name').select('-__v');
  next();
});

const Review = mongoose.model('reviews', reviewSchema);

module.exports = Review;
