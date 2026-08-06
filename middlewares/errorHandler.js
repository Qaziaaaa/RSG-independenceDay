const ApiError = require('../utils/apiError');
const { NODE_ENV } = require('../config');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;
  error.errors = Array.isArray(err.errors) ? err.errors : [];

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    error = new ApiError(`${field} already exists`, 400, [`${field} must be unique`]);
  }

  if (err.name === 'CastError') {
    error = new ApiError(`Invalid ${err.path}`, 400, [`Invalid value provided for ${err.path}`]);
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    error = new ApiError('Validation error', 400, messages);
  }

  if (err.name === 'JsonWebTokenError') {
    error = new ApiError('Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    error = new ApiError('Token expired', 401);
  }

  if (!error.isOperational) {
    error.message = NODE_ENV === 'production' ? 'Internal server error' : error.message;
  }

  return res.status(error.statusCode).json({
    success: false,
    message: error.message || 'Server error',
    errors: error.errors,
  });
};

module.exports = errorHandler;
