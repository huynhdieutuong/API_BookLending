const express = require("express");
const router = express.Router();

const {
  add,
  index,
  deleteBook,
  decrease,
  increase,
  number,
  transaction
} = require("../controllers/cart");

const { requiredAuth } = require("../middlewares/auth");

// Add to cart
router.put("/add/:bookId", add);

// Cart index
router.get("/", index);

// Delete book
router.put("/delete/:bookId", deleteBook);

// Change number
router.put("/decrease/:bookId", decrease);
router.put("/increase/:bookId", increase);
router.put("/number/:bookId", number);

// Make transaction
router.post("/transaction", requiredAuth, transaction);

module.exports = router;
