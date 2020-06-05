const calPagination = require('../../utils/pagination');
const Transaction = require('../../models/Transaction');

// Show all transactions
module.exports.index = async (req, res) => {
  var transactions;

  if (req.user.isAdmin) {
    transactions = await Transaction.find()
      .sort('-date')
      .populate({ path: 'books', select: 'title' })
      .populate({ path: 'user', select: 'name' });
  } else {
    transactions = await Transaction.find({ user: req.user.id })
      .sort('-date')
      .populate({ path: 'books', select: 'title' })
      .populate({ path: 'user', select: 'name' });
  }

  var filtered = [...transactions];

  // Search
  if (req.query.q) {
    filtered = transactions.filter(
      (transaction) =>
        transaction.id.toLowerCase().indexOf(req.query.q.toLowerCase()) !== -1
    );
  }

  // Pagination
  var result = calPagination(req.query.page, req.query.perPage, filtered);

  res.json({
    transactions: result.filtered,
    pagination: result.pagination,
  });
};

// Show transaction
module.exports.view = async (req, res) => {
  try {
    var transaction = await Transaction.findById(req.params.id).populate(
      'books user'
    );

    if (!transaction) {
      return res.status(404).json({ errors: ['Transaction not found'] });
    }

    if (transaction.user.id !== req.user.id && !req.user.isAdmin) {
      return res
        .status(401)
        .json({ errors: ['User is not authorized to view this transaction'] });
    }

    res.json(transaction);
  } catch (error) {
    return res.status(404).json({ errors: ['Transaction not found'] });
  }
};

// Create transaction
module.exports.create = async (req, res) => {
  if (typeof req.body.books === 'string') {
    req.body.books = [req.body.books];
  }
  var newTransaction = req.body;

  var transaction = await Transaction.create(newTransaction);

  res.json(transaction);
};

// Edit transaction
module.exports.edit = async (req, res) => {
  try {
    var transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ errors: ['Transaction not found'] });
    }

    if (req.body.books) {
      if (typeof req.body.books === 'string') {
        transaction.books = [req.body.books];
      } else {
        transaction.books = req.body.books;
      }
    }

    if (req.body.user) {
      transaction.user = req.body.user;
    }

    await transaction.save();

    res.json(transaction);
  } catch (error) {
    return res.status(404).json({ errors: ['Transaction not found'] });
  }
};

// Delete transaction
module.exports.deleteTran = async (req, res) => {
  try {
    var transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ errors: ['Transaction not found'] });
    }

    await transaction.remove();

    res.json({});
  } catch (error) {
    return res.status(404).json({ errors: ['Transaction not found'] });
  }
};

// Complete transaction
module.exports.complete = async (req, res) => {
  try {
    var transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ errors: ['Transaction not found'] });
    }

    transaction.isComplete = !transaction.isComplete;
    await transaction.save();

    res.json(transaction);
  } catch (error) {
    return res.status(404).json({ errors: ['Transaction not found'] });
  }
};
