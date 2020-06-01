const express = require("express");
const router = express.Router();
var multer = require("multer");
var upload = multer({ dest: "public/uploads/books/" });

const { index, view, add, edit, deleteBook } = require("../controllers/books");

const validations = require("../validations/books");

const { requiredAdmin } = require("../middlewares/auth");

// Show all books
router.get("/", index);

// Show single book
router.get("/:id/view", view);

// Require admin
router.use(requiredAdmin);

// Add book
router.post("/add", upload.single("cover"), validations.add, add);

// Edit book
router.put("/:id/edit", upload.single("cover"), edit);

// Delete book
router.delete("/:id/delete", deleteBook);

module.exports = router;
