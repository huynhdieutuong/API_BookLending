const express = require("express");
const router = express.Router();

const {
  index,
  view,
  create,
  edit,
  deleteTran,
  complete
} = require("../controllers/transactions");

const validations = require("../validations/transactions");

const { requiredAuth, requiredAdmin } = require("../middlewares/auth");

// Require auth
router.use(requiredAuth);

// Show all transactions
router.get("/", index);

// Show transaction
router.get("/:id/view", view);

// Require admin
router.use(requiredAdmin);

// Create transaction
router.post("/create", validations.create, create);

// Edit transaction
router.put("/:id/edit", edit);

// Delete transaction
router.delete("/:id/delete", deleteTran);

// Complete transaction
router.patch("/:id/complete", complete);

module.exports = router;
