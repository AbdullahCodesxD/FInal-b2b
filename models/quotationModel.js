const mongoose = require('mongoose');

const quotationSchema = mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, 'Please provide product name'],
      minLength: [3, 'Product name must be at least 3 characters'],
      maxLength: [40, 'Product name cannot exceed 40 characters'],
    },
    quantity: {
      type: Number,
      min: [0, 'Must be at least 1'],
    },
    description: {
      type: String,

      minLength: [30, 'Description must at least be 30 characters'],
      maxLength: [300, 'Description cannot be more then 300 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [1, 'Price must atleast be 1'],
    },
    reason: {
      type: String,

      minLength: [5, 'Reason must have at least 5 characters'],
      maxLength: [50, 'Reason cannot exceed 50 characters'],
    },
    url: String,
    media: [String],
    offer: {
      type: String,
      minLength: [5, 'Offer must have at least 5 characters'],
      maxLength: [500, 'Offer cannot have moer then 500 characters'],
    },
    vendor: {
      type: mongoose.Schema.ObjectId,
      ref: 'users',
    },
    isVendor: {
      type: Boolean,
      default: false,
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

const Product = mongoose.model('quotations', quotationSchema);

module.exports = Product;
