const cloudinary = require('cloudinary').v2;

const Book = require('../../models/Book');
const calPagination = require('../../utils/pagination');

// Show all books
module.exports.index = async (req, res) => {
  var books = await Book.find().sort('-date');
  var filtered = [...books];

  if (req.query.q) {
    filtered = books.filter(
      (book) =>
        book.title.toLowerCase().indexOf(req.query.q.toLowerCase()) !== -1
    );
  }

  // Pagination
  let result;
  if (req.query.page) {
    result = calPagination(req.query.page, req.query.perPage, filtered);
  }

  if (result) {
    res.json({
      books: result.filtered,
      pagination: result.pagination,
    });
  } else {
    res.json({
      books: filtered,
    });
  }
};

// Show book
module.exports.view = async (req, res) => {
  try {
    var book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ errors: ['Book not found'] });
    }

    res.json(book);
  } catch (error) {
    return res.status(404).json({ errors: ['Book not found'] });
  }
};

// Add book
module.exports.add = async (req, res) => {
  var newBook = req.body;

  if (req.file && req.file.path) {
    var result = await cloudinary.uploader.upload(req.file.path, {
      public_id: 'BookManagement/Books/' + req.file.filename,
    });

    newBook.coverUrl = result.url;
  }

  var book = await Book.create(newBook);

  res.json(book);
};

// Edit book
module.exports.edit = async (req, res) => {
  try {
    var book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ errors: ['Book not found'] });
    }

    if (req.file && req.file.path) {
      var result = await cloudinary.uploader.upload(req.file.path, {
        public_id: 'BookManagement/Books/' + req.file.filename,
      });

      book.coverUrl = result.url;
    }

    for (let x in req.body) {
      book[x] = req.body[x];
    }

    await book.save();

    res.json(book);
  } catch (error) {
    return res.status(404).json({ errors: ['Book not found'] });
  }
};

// Delete book
module.exports.deleteBook = async (req, res) => {
  try {
    var book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ errors: ['Book not found'] });
    }

    await book.remove();

    res.json({});
  } catch (error) {
    return res.status(404).json({ errors: ['Book not found'] });
  }
};
