const Quotation = require('../models/quotationModel');
const { $where } = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const multer = require('multer');

const filter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('The passed file aint image', 400), false);
  }
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(false, `${__dirname}/../images/quote`);
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split('/')[1];
    const imgUrlFormat = `user_${req.user.id}_${Date.now()}.${ext}`;

    cb(false, imgUrlFormat);
  },
});

const upload = multer({
  storage,
  fileFilter: filter,
});

exports.uploadQuote = upload.fields([{ name: 'quote', maxCount: 3 }]);
/////////////////////////////////////
////////////Create Quotation/////////
/////////////////////////////////////
exports.createQuotation = catchAsync(async (req, res, next) => {
  const body = req.body;

  const media = req.files.quote.map((file) => file.filename);

  const quote = await Quotation.create({
    ...body,
    media,
    user: req.user._id,
  });
  res.status(201).json({
    status: 'success',
    quote,
  });
});

exports.createSellerQuote = catchAsync(async (req, res, next) => {
  const body = req.body;
  const media = req.files.quote.map((file) => file.filename);

  const vendor = req.user._id;
  console.log(vendor);
  const quote = await Quotation.create({
    ...body,
    media,
    vendor: vendor,
  });
  res.status(201).json({ status: 'success', quote });
});
exports.getQuotes = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const quotes = await Quotation.find({ user: userId, isVendor: true });

  res.status(200).json({
    message: 'success',
    quotes,
  });
});
exports.getQuote = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const quote = await Quotation.findById(id);

  res.status(200).json({
    message: 'success',
    quote,
  });
});
exports.getAllQuotes = catchAsync(async (req, res, next) => {
  const quotes = await Quotation.find({ isVendor: false });

  res.status(200).json({
    message: 'success',
    quotes,
  });
});
