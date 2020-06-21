const express = require('express');
const router = express.Router();

const { login, register, loginSocial } = require('../controllers/auth');

const validations = require('../validations/auth');

const { requiredAuth } = require('../middlewares/auth');

// Login
router.post('/login', validations.login, login);

// Login Social
router.post('/login-social', loginSocial);

// Register
router.post('/register', validations.register, register);

module.exports = router;
