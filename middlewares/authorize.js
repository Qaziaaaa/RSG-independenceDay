const ApiError = require('../utils/apiError');

const authorize = (...roles) => (req, res, next) => {
  if (!req.admin || !roles.includes(req.admin.role)) {
    return next(new ApiError('Not authorized to access this route', 403));
  }
  next();
};

module.exports = authorize;
