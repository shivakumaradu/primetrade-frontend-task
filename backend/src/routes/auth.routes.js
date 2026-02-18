const express = require('express');
const router = express.Router();

const { register, login, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { registerValidator, loginValidator } = require('../middleware/validation.middleware');

// POST /api/auth/register
router.post('/register', registerValidator, register);

// POST /api/auth/login
router.post('/login', loginValidator, login);

// GET /api/auth/me  (protected - validate token on app load)
router.get('/me', protect, getMe);

module.exports = router;
