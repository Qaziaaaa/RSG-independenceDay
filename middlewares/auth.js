const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/apiError');
const Admin = require('../models/adminModel');
const { verifyToken } = require('../utils/jwt');

const extractToken = (req) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

const protect = catchAsync(async (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    return next(new ApiError('Not authorized, no token provided', 401));
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    const message = err.name === 'TokenExpiredError' ? 'Not authorized, token expired' : 'Not authorized, invalid token';
    return next(new ApiError(message, 401));
  }

  const admin = await Admin.findById(decoded.id).select('-password');
  if (!admin || !admin.isActive) {
    return next(new ApiError('Not authorized, account no longer exists or is deactivated', 401));
  }

  req.admin = admin;
  next();
});

module.exports = { protect };
