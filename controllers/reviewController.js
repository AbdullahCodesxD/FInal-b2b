const Review = require('../models/reviewModel');
const Product = require('../models/productModel');

const catchAsync = require('../utils/catchAsync');

const AppError = require('../utils/appError');

///////////////////////////////////////
//////////////Get All REview////////////
///////////////////////////////////////
exports.allReviews = catchAsync(async (req, res, next) => {
  if (!req.params.productId) req.params.productId = req.body.productId;

  const product = await Product.findById(req.params.productId);
  if (!product) return next(new AppError('No product found', 404));

  const reviews = await Review.find({ product: req.params.productId });

  res.status(200).json({
    message: 'success',
    noOfReviews: reviews.length,
    reviews,
  });
});

///////////////////////////////////////
//////////////Add A REview////////////
///////////////////////////////////////
exports.addReview = catchAsync(async (req, res, next) => {
  if (!req.params.productId) req.params.productId = req.body.productId;

  const product = await Product.findById(req.params.productId);

  if (!product) return next(new AppError('No product found', 404));

  const newReview = await Review.create({
    ...req.body,
    product: product._id,
    user: req.user._id,
  });

  res.status(200).json({
    status: 'success',
    review: newReview,
  });
});
