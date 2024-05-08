const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const Product = require('../models/productModel');

// const http = require('http');
const multer = require('multer');
///////////////////////////////////////////////

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/../images/users`);
  },
  filename: async function (req, file, cb) {
    const ext = file.mimetype.split('/')[1];
    const imgUrlFormat = `user_${req.user.id}_${file.fieldname}.${ext}`;

    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      { userImage: imgUrlFormat },
      { new: true },
    );
    cb(null, imgUrlFormat);
  },
});
const filter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('The passed file aint image', 400), false);
  }
};

const upload = multer({ fileFilter: filter, storage });

exports.uploadImages = upload.single('photo');
exports.uploadImage = catchAsync(async (req, res, next) => {
  res.status(200).json({ message: 'success' });
});
////////////////////////////////////
////Update Currently Logged In User
////////////////////////////////////
exports.userDetails = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ _id: req.user._id }).select(
    '+country +region +accountType +role +_id',
  );

  res.status(200).json({
    status: 'success',
    data: user,
  });
});
////////////////////////////////////
////Update Currently Logged In User
////////////////////////////////////
exports.updateUser = catchAsync(async (req, res, next) => {
  const { address, country, accountType, password } = req.body;
  if (password)
    return next(new AppError(`You cannot update password here.`, 403));

  const updateDetails = {
    address,
    country,
    accountType,
  };
  console.log(updateDetails);

  const user = await User.findOneAndUpdate(
    { _id: req.user.id },
    updateDetails,
    {
      new: true,
      // runValidators: true,
    },
  );
  res.status(201).json({
    status: 'Success',
    message: 'User updated successfully',
  });
});

exports.getAUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const user = await User.findById(id).select('userImage name');

  res.status(200).json({
    message: 'success',
    user,
  });
});

////////////////////////////////////
////Get All users for admin
////////////////////////////////////
exports.getAllUsers = catchAsync(async (req, res, next) => {
  // const getUser = await User.findOne({ _id: req.user.id }).select('+role');

  // if (getUser.role !== 'admin')
  //   return next(
  //     new AppError("You don't have permission to perform this action", 403),
  //   );

  const { region, role } = req.query;

  const checkIfSearchByRegionOrRole =
    (region && role && { region, role }) ||
    (region && { region: region }) ||
    (role && { role: role });

  const allUsers = await User.find(checkIfSearchByRegionOrRole)
    .select('+country')
    .select('+region')
    .select('+role')
    .select('+address')
    .select('-__v');

  res.status(200).json({
    message: 'Success',
    noOfUsers: allUsers.length,
    allUsers,
  });
});

/////////////////////
////Buy A Product
////////////////////////////////////
exports.buyAProduct = catchAsync(async (req, res, next) => {
  const { productId } = req.body;

  const product = await Product.findById(productId);
  if (!product) return next(new AppError('Product not found', 404));

  const user = await User.findById(req.user._id).select('+role');
  if (!user) return next(new AppError('Something went wrond', 403));

  const isSeller = user.role === 'seller';
  if (isSeller) return next(new AppError('Only buyers can buy products', 403));

  const addTheProductToUser = await User.findById(req.user._id).select(
    '+bought',
  );

  // addTheProductToUser.bought = [...addTheProductToUser.bought,product._id]

  res.status(200).json({
    message: 'Pending',
    product,
  });
});
