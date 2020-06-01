const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  cart: [
    {
      book: {
        type: mongoose.Types.ObjectId,
        ref: "Book"
      },
      quantity: {
        type: Number,
        default: 0
      }
    }
  ],
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("CartSession", cartSchema);
