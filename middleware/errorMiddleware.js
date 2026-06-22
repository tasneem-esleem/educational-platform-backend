// const AppError = require('../utils/AppError');

// const handleCastErrorDB = (err) => {
//   return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
// };

// const handleDuplicateFieldsDB = (err) => {
//   const field = Object.keys(err.keyValue)[0];
//   const value = err.keyValue[field];
//   return new AppError(`The ${field} '${value}' is already in use`, 409);
// };

// const handleValidationErrorDB = (err) => {
//   const messages = Object.values(err.errors).map((el) => el.message);
//   return new AppError(`Invalid input data: ${messages.join('. ')}`, 400);
// };

// const handleJWTError = () => new AppError('Invalid token, please log in again', 401);

// const handleJWTExpiredError = () => new AppError('Your token has expired, please log in again', 401);

// const sendErrorDev = (err, res) => {
//   res.status(err.statusCode).json({
//     success: false,
//     status: err.status,
//     message: err.message,
//     stack: err.stack,
//     error: err,
//   });
// };

// const sendErrorProd = (err, res) => {
//   if (err.isOperational) {
//     return res.status(err.statusCode).json({
//       success: false,
//       message: err.message,
//     });
//   }

//   console.error('UNEXPECTED ERROR:', err);
//   res.status(500).json({
//     success: false,
//     message: 'Something went wrong, please try again later',
//   });
// };

// const errorHandler = (err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.statusCode >= 500 ? 'error' : 'fail';

//   let error = err;

//   if (err.name === 'CastError') error = handleCastErrorDB(err);
//   if (err.code === 11000) error = handleDuplicateFieldsDB(err);
//   if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
//   if (err.name === 'JsonWebTokenError') error = handleJWTError();
//   if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

//   if (!error.statusCode) {
//     error.statusCode = err.statusCode;
//     error.status = err.status;
//     error.isOperational = err.isOperational;
//   }

//   if (process.env.NODE_ENV === 'development') {
//     sendErrorDev(error, res);
//   } else {
//     sendErrorProd(error, res);
//   }
// };

// module.exports = errorHandler;
const AppError = require('../utils/AppError');

const handleCastErrorDB = (err) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  return new AppError(`The ${field} '${value}' is already in use`, 409);
};

const handleValidationErrorDB = (err) => {
  const messages = Object.values(err.errors).map((el) => el.message);
  return new AppError(`Invalid input data: ${messages.join('. ')}`, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token, please log in again', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired, please log in again', 401);

// 🔥 UNIFIED ERROR RESPONSE (NEW)
const sendError = (err, res) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    statusCode,
    message: err.message,
    error: {
      type: err.name || "Error",
      isOperational: err.isOperational || false,
    },
  });
};

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  if (err.name === 'CastError') error = handleCastErrorDB(err);
  if (err.code === 11000) error = handleDuplicateFieldsDB(err);
  if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

  sendError(error, res);
};

module.exports = errorHandler;