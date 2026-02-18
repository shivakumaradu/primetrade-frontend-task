const express = require('express');
const router = express.Router();

const { getProfile, updateProfile } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');
const { updateProfileValidator } = require('../middleware/validation.middleware');

// All routes below are protected
router.use(protect);

// GET /api/user/profile
router.get('/profile', getProfile);

// PUT /api/user/profile
router.put('/profile', updateProfileValidator, updateProfile);

module.exports = router;
