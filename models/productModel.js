const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A title is required for a product'],
    minLength: [4, 'A title name must have at least 4 characters'],
  },
  description: {
    type: String,
    required: [true, 'A description is required for a product'],
    minLength: [150, 'A description must at least be 150 characters'],
  },
  quanPrice: {
    type: [Object],
    required: [true, 'Price and Quantity are required'],
  },
  status: {
    type: String,
    default: 'active',
    enum: {
      values: ['active', 'archive', 'draft'],
      message: 'Status can either be active archive or draft',
    },
  },
  category: {
    type: String,
    required: [true, 'Please provide a category for your product'],
  },
  media: {
    type: [String],
  },
  certificates: {
    type: [String],
  },
  markets: {
    type: [String],
  },
  origin: {
    type: String,
    required: [true, 'Origin is required'],
  },
  brandName: {
    type: String,
    required: [true, 'Brand name is required'],
  },
  modelNo: {
    type: String,
    required: [true, 'Model no is required'],
  },
  use: {
    type: String,
  },
  feature: {
    type: String,
  },
  productType: {
    type: String,
  },
  ingredient: {
    type: String,
  },
  form: {
    type: String,
  },
  productName: {
    type: String,
  },
  productFunction: {
    type: String,
  },
  color: {
    type: [String],
  },
  keywords: {
    type: [String],
  },
  shelf: {
    type: String,
  },
  logo: {
    type: String,
  },
  service: {
    type: String,
  },
  vendor: {
    type: mongoose.SchemaTypes.ObjectId,
  },
});

const Product = mongoose.model('products', productSchema);

module.exports = Product;
