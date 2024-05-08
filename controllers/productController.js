const Product = require('./../models/productModel');
const Shop = require('./../models/shopModel');
const AppError = require('../utils/appError');

const catchAsync = require('../utils/catchAsync');

const multer = require('multer');

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('The passed file aint image', 400), false);
  }
};
const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/../images/product`);
  },
  filename: async function (req, file, cb) {
    const ext = file.mimetype.split('/')[1];
    const imgUrlFormat = `user_${req.user.id}_${Date.now()}.${ext}`;

    cb(false, imgUrlFormat);
  },
});
const uploadProducts = multer({
  storage: productStorage,
  fileFilter: multerFilter,
});

////////////////////////////////////
////Add product images
////////////////////////////////////

exports.addProductImages = uploadProducts.fields([
  { name: 'media', maxCount: 4 },
  { name: 'certificate', maxCount: 4 },
]);

////////////////////////////////////
////Add A product
////////////////////////////////////
exports.addProduct = catchAsync(async function (req, res, next) {
  const body = req.body;

  const mediaDestionations = req.files.media.map((media) => media.filename);
  const certificateDestionations = req.files.certificate.map(
    (certificate) => certificate.filename,
  );

  body.media = mediaDestionations;
  body.certificates = certificateDestionations;
  body.vendor = req.user._id;

  const product = await Product.create(body);

  res.status(201).json({
    message: 'success',
    product,
  });
});
////////////////////////////////////
////Get All product
////////////////////////////////////
exports.getAllProducts = catchAsync(async function (req, res, next) {
  const userId = req.user._id;

  const allProductsByUser = await Product.find({ vendor: userId }).select(
    'title status media markets category',
  );
  allProductsByUser.name = req.user.name;
  res.status(200).json({
    message: 'success',
    allProductsByUser,
  });
});
////////////////////////////////////
////Delete a product
////////////////////////////////////
exports.deleteAProduct = catchAsync(async function (req, res, next) {
  const id = req.body.id;

  await Product.findByIdAndDelete(id);

  res.status(204).json({
    message: 'success',
  });
});
////////////////////////////////////
////update a product
////////////////////////////////////
exports.updateAProduct = catchAsync(async function (req, res, next) {
  const id = req.body.productId;

  const product = await Product.findById(id);

  if (product.vendor != req.user.id)
    return next(
      new AppError('You dont have permission to perform this action', 403),
    );

  const newProduct = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.status(201).json({
    message: 'success',
    product: newProduct,
  });
});
////////////////////////////////////
////Get a product
////////////////////////////////////
exports.getProductDetails = catchAsync(async function (req, res, next) {
  const productId = req.params.productId;

  const product = await Product.findById(productId);
  const vendor = await Shop.find({ shopOwner: product.vendor });
  // const productCertificates = product.certificates;
  res.status(200).json({
    status: 'success',
    product,
    // productCertificates,
    vendor,
  });
});
