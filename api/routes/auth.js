const express = require("express");
const router = express.Router();

const { login, register } = require("../controllers/auth");

const validations = require("../validations/auth");

const { requiredAuth } = require("../middlewares/auth");

// Login
router.post("/login", validations.login, login);

// Register
router.post("/register", validations.register, register);

module.exports = router;
