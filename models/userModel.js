const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name.'],
    minLength: [3, 'Name must have at least 3 characters.'],
    trim: true,
    validate: {
      message: 'Last Name cannot contain special characters',
      validator: function (val) {
        return validator.isAlpha(val, 'en-US');
      },
    },
  },
  lastName: {
    type: String,
    required: [true, 'A user must have a last name'],
    minLength: [3, 'Last Name must have at least 3 characters'],
    trim: true,
    validate: {
      message: 'Last Name cannot contain special characters',
      validator: function (val) {
        return validator.isAlpha(val);
      },
    },
  },
  email: {
    type: String,
    required: [true, 'A user must have an email.'],
    unique: [true, 'A user with this email already exists.'],
    validate: {
      message: 'Please provide a valid email address',
      validator: function (val) {
        return validator.isEmail(val);
      },
    },
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minLength: [7, 'A password must have at least 7 characters.'],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm password'],
    validate: {
      message: "Password don't match try again.",
      validator: function (val) {
        return this.password === val;
      },
    },
  },
  passwordChangedAt: {
    type: Date,
    select: false,
  },
  country: {
    type: String,
    select: false,
    default: '',
    // required: [true, 'You must provide your country'],
  },
  region: {
    type: String,
    select: false,
    default: '',
    // required: [true, 'You must provide your region'],
  },
  accountType: {
    type: String,
    enum: ['individual', 'bussiness'],
    default: 'individual',
  },
  role: {
    type: String,
    select: false,
    enum: ['admin', 'regional-admin', 'seller', 'buyer'],
    default: 'buyer',
  },
  userImage: {
    type: String,
    default: 'default.png',
  },
  address: {
    type: String,
    select: false,
    default: '',
  },
  bought: {
    type: [String],
    select: false,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },
  isSent: {
    type: Boolean,
    default: false,
  },
  messageSent: [
    { type: mongoose.SchemaTypes.ObjectId, ref: 'users', select: false },
  ],
});

userSchema.pre('save', async function (next) {
  // if (this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;

  next();
});
userSchema.methods.checkPassword = async function (
  candidatePassword,
  userPassword,
) {
  // Candidate Password is the password given by user and
  // userPassword is the password present in the database
  const check = await bcrypt.compare(candidatePassword, userPassword);
  return check;
};
userSchema.methods.checkPasswordChangedAt = async function (timeRightNow) {
  console.log(
    this,
    timeRightNow,
    '----------------------------------------------',
  );

  return false;
};

const User = mongoose.model('users', userSchema);

module.exports = User;
