///////////////////////////////////////////
// HANDLING Fail ERRROR
///////////////////////////////////////////
const handleFailErrors = function (res, err) {
  const message = err.message || 'Something went wrong';
  const status = err.status || 'Error';
  res.status(err.statusCode).json({
    status,
    message,
  });
};
///////////////////////////////////////////
// HANDLING VALIDATION ERRROR
///////////////////////////////////////////
const handleValidationErrors = function (res, err) {
  const errMessages = Object.keys(err.errors)
    .map((el) => err.errors[el].message)
    .join(' ');
  const status = err.status || 500;
  res.status(status).json({
    status: 'fail',
    message: errMessages,
  });
};
///////////////////////////////////////////
// HANDLING Mongoose ERRROR
///////////////////////////////////////////;
const handleMongooseErrors = function (res, err) {
  const status = err.status || 500;
  const email = err.message.split('"')[1];

  const message = `User with email ${email} already exists`;
  res.status(status).json({
    status: 'fail',
    message,
  });
};

///////////////////////////////////////////
// HANDLING Production ERRROR
///////////////////////////////////////////
const handleProductionError = function (res, err) {
  const message = err.message || 'Something went wrong';
  const status = err.status || 500;

  res.status(status).json({
    status: 'fail',
    message,
  });
};
///////////////////////////////////////////
// HANDLING Cast ERRROR
///////////////////////////////////////////
const handleCastError = function (res, err) {
  const message = 'Bad request';
  const status = err.status || 403;

  res.status(status).json({
    status: 'fail',
    message,
  });
};
///////////////////////////////////////////
// HANDLING Development ERRROR
///////////////////////////////////////////
const handleDevErr = function (res, err) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';
  res.status(statusCode).json({
    status: 'fail',
    stack: err.stack,
    message,
    err,
  });
};

module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    return handleDevErr(res, err);
  }

  if (err.status === 'fail') return handleFailErrors(res, err);
  if (err.name === 'ValidationError') return handleValidationErrors(res, err);
  if (err.code === 11000) return handleMongooseErrors(res, err);
  if (err.name === 'CastError') return handleCastError(res, err);
  handleProductionError(res, err);
};
