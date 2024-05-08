const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const Shop = require('../models/shopModel');
const Product = require('../models/productModel');

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/../images/stores`);
  },
  filename: async function (req, file, cb) {
    const ext = file.mimetype.split('/')[1];
    const imgUrlFormat = `user_${req.user.id}_${Date.now()}.${ext}`;

    cb(false, imgUrlFormat);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('The passed file aint image', 400), false);
  }
};
const upload = multer({
  fileFilter: multerFilter,
  storage,
});

exports.addShopImages = upload.fields([{ name: 'gallery', maxCount: 3 }]);
// Create Shop
exports.createShop = catchAsync(async function (req, res, next) {
  const data = req.body;
  const files = req.files;
  const galleryArr = [];
  if (files.gallery) {
    files.gallery.forEach((file) => {
      galleryArr.push(file.filename);
    });
    data.gallery = galleryArr;
  }

  // addShopImages(req.files);
  data.shopOwner = req.user._id;
  const shopAlreadyExists = await Shop.findOne({ shopOwner: req.user._id });

  if (shopAlreadyExists)
    return next(new AppError('You already have a store', 403));

  await Shop.create(data);

  res.status(201).json({
    message: 'success',
    data,
  });
});
exports.getShop = catchAsync(async function (req, res, next) {
  const data = await Shop.findById(req.params.id);
  res.status(200).json({
    message: 'Success',
    data,
  });
});
exports.getUserProducts = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const ownerId = await Shop.findById(id).select('shopOwner');

  const products = await Product.find({ vendor: ownerId.shopOwner });
  res.status(200).json({
    message: 'success',
    products,
  });
});
exports.getAllStores = catchAsync(async function (req, res, next) {
  const id = req.user._id;
  const stores = await Shop.find({ shopOwner: id });

  res.status(200).json({
    message: 'success',
    noOfStores: stores.length,
    stores,
  });
});
