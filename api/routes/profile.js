const express = require("express");
const router = express.Router();
var multer = require("multer");
var upload = multer({ dest: "public/uploads/avatars/" });

const { index, update, avatar, password } = require("../controllers/profile");

const validations = require("../validations/profile");

const { requiredAuth } = require("../middlewares/auth");

// Require auth
router.use(requiredAuth);

// Show profile
router.get("/", index);

// Update profile
router.put("/update", update);

// Update avatar
router.put("/avatar", upload.single("avatar"), validations.avatar, avatar);

// Change password
router.put("/password", validations.password, password);

module.exports = router;
