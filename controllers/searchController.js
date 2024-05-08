const Product = require('./../models/productModel');
const Shop = require('../models/shopModel');
const catchAsync = require('../utils/catchAsync');

exports.searchProducts = catchAsync(async (req, res) => {
  // 1) Search for product
  const search = req.params.search.toLowerCase().trim();

  const query = await Product.find(
    {
      $or: [
        { title: { $regex: search } },
        { description: { $regex: search } },
        { keywords: { $regex: search } },
        { productName: { $regex: search } },
      ],
    },
    'title description media _id quanPrice vendor',
  );

  res.status(200).json({
    noOfProducts: query.length,
    data: query,
    search: search,
  });
});

exports.searchProductByCategory = catchAsync(async (req, res) => {
  const category = req.params.category.toLowerCase().trim();

  const query = await Product.find(
    {
      category,
    },
    'title description media',
  );

  res.status(200).json({
    data: query.length > 0 ? query : `No product found in the category :(`,
    category,
  });
});
