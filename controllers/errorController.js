const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errorResponse.errmsg.match(/(["'])(.*?)\1/).at(0);
  const message = `Duplicate field value ${value}. Use another value.`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const message = err.message;

  return new AppError(message, 400);
};
const sendErrorDev = (err, res) => {
  res.status(err.statusCode);
  res.json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode);
    res.json({
      status: err.status,
      message: err.message,
    });
    // Programming or other unknown error: don't leak error details
  } else {
    // 1) log error
    console.error('Error: 💔💔', err);
    // 2) Send generic message
    res.status(500);
    res.json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

// Global Error Handler: One Central error handler
module.exports = (err, req, res, next) => {
  //   console.log(err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    // Copy prototype properties (like `name`)
    error.name = err.name;
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.errorResponse?.code === 11000)
      error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    sendErrorProd(error, res);
  }
};
