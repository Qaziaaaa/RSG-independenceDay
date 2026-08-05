const Admin = require('../models/adminModel');
const ApiError = require('../utils/apiError');
const { signToken } = require('../utils/jwt');

exports.login = async (email, password) => {
  const admin = await Admin.findOne({ email }).select('+password');
  if (!admin || !(await admin.matchPassword(password))) {
    throw new ApiError('Invalid email or password', 401);
  }
  if (!admin.isActive) {
    throw new ApiError('Account has been deactivated, contact support', 403);
  }

  const token = signToken({ id: admin._id, role: admin.role });
  return {
    token,
    admin: admin.toSafeObject(),
  };
};

exports.getProfile = async (adminId) => {
  const admin = await Admin.findById(adminId).select('-password');
  if (!admin) {
    throw new ApiError('Admin not found', 404);
  }
  return admin;
};
