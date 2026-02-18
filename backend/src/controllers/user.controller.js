const User = require('../models/user.model');

/**
 * @desc    Get current user's profile
 * @route   GET /api/user/profile
 * @access  Private
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update current user's profile
 * @route   PUT /api/user/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Check if new email is already taken by another user
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email, _id: { $ne: user._id } });
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: 'This email address is already in use.',
        });
      }
      user.email = email;
    }

    if (name) user.name = name;

    // If updating password, it will be re-hashed via pre-save hook
    if (password) user.password = password;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: { user: user.toSafeObject() },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile };
