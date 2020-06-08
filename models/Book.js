const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  coverUrl: {
    type: String,
    default:
      'https://res.cloudinary.com/dbu9wn1oz/image/upload/v1591615171/BookManagement/Books/book-cover-default.png',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Book', bookSchema);
