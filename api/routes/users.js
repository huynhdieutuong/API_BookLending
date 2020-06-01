const express = require("express");
const router = express.Router();

const { index, view, add, edit, deleteUser } = require("../controllers/users");

const validations = require("../validations/users");

const { requiredAdmin } = require("../middlewares/auth");

// Require admin
router.use(requiredAdmin);

// Show all users
router.get("/", index);

// Show user
router.get("/:id/view", view);

// Add user
router.post("/add", validations.add, add);

// Edit user
router.put("/:id/edit", validations.edit, edit);

// Delete user
router.delete("/:id/delete", deleteUser);

module.exports = router;
