const CartSession = require('../../models/CartSession');
const Transaction = require('../../models/Transaction');

// Index
module.exports.index = async (req, res) => {
  var cartSession = await CartSession.findOne({ user: req.user.id }).populate(
    'cart.book'
  );

  if (!cartSession) {
    cartSession = await CartSession.create({ cart: [], user: req.user.id });
  }

  var cart = cartSession.cart;

  res.json(cart);
};

// Add to cart
module.exports.add = async (req, res) => {
  var cartSession = await CartSession.findOne({ user: req.user.id });

  var cart = cartSession.cart;
  if (cart.length) {
    var existItem = null;
    cart.forEach((item) => {
      if (item.book.toString() === req.params.bookId) {
        item.quantity += 1;
        existItem = item;
      }
    });

    if (!existItem) {
      cart.push({ book: req.params.bookId, quantity: 1 });
    }
  } else {
    cart.push({ book: req.params.bookId, quantity: 1 });
  }

  await cartSession.save();

  cartSession = await cartSession.populate('cart.book').execPopulate();

  res.json(cart);
};

// Delete book
module.exports.deleteBook = async (req, res) => {
  var cartSession = await CartSession.findOne({ user: req.user.id });

  var cart = cartSession.cart;

  cart.forEach((item, index) => {
    if (item.book.toString() === req.params.bookId) {
      cart.splice(index, 1);
    }
  });

  await cartSession.save();

  cartSession = await cartSession.populate('cart.book').execPopulate();

  res.json(cart);
};

// Decrease number
module.exports.decrease = async (req, res) => {
  var cartSession = await CartSession.findOne({ user: req.user.id });

  var cart = cartSession.cart;

  var count;
  var indexItem;
  cart.forEach((item, index) => {
    if (item.book.toString() === req.params.bookId) {
      count = item.quantity;
      indexItem = index;
    }
  });

  if (count <= 1) {
    cart.splice(indexItem, 1);
  } else {
    cart[indexItem].quantity -= 1;
  }

  await cartSession.save();

  cartSession = await cartSession.populate('cart.book').execPopulate();

  res.json(cart);
};

// Increase number
module.exports.increase = async (req, res) => {
  var cartSession = await CartSession.findOne({ user: req.user.id });

  var cart = cartSession.cart;

  var count;
  var indexItem;
  cart.forEach((item, index) => {
    if (item.book.toString() === req.params.bookId) {
      count = item.quantity;
      indexItem = index;
    }
  });

  cart[indexItem].quantity += 1;

  await cartSession.save();

  cartSession = await cartSession.populate('cart.book').execPopulate();

  res.json(cart);
};

// Change number
module.exports.number = async (req, res) => {
  const number = parseInt(req.body.number);
  var cartSession = await CartSession.findOne({ user: req.user.id });

  var cart = cartSession.cart;

  var count;
  var indexItem;
  cart.forEach((item, index) => {
    if (item.book.toString() === req.params.bookId) {
      count = item.quantity;
      indexItem = index;
    }
  });

  if (number <= 0) {
    cart.splice(indexItem, 1);
  } else {
    cart[indexItem].quantity = number;
  }

  await cartSession.save();

  cartSession = await cartSession.populate('cart.book').execPopulate();

  res.json(cart);
};

// Make transaction
module.exports.transaction = async (req, res) => {
  var cartSession = await CartSession.findOne({ user: req.user.id });

  var cart = cartSession.cart;

  if (cart.length) {
    // Create new transaction
    var books = [];
    for (let item of cart) {
      books.push(item.book);
    }

    var newTransaction = {
      user: req.user.id,
      books,
    };

    var transaction = await Transaction.create(newTransaction);

    // Delete books in cart
    cartSession.cart = [];
    await cartSession.save();

    res.json({ transaction, cartSession });
  }
};
