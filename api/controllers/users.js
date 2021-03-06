const bcrypt = require('bcrypt');
const calPagination = require('../../utils/pagination');
const User = require('../../models/User');
const Transaction = require('../../models/Transaction');
const CartSession = require('../../models/CartSession');

// Show all users
module.exports.index = async (req, res) => {
  var users = await User.find({ isAdmin: false });
  var filtered = [...users];

  if (req.query.q) {
    filtered = users.filter(
      (user) =>
        user.name.toLowerCase().indexOf(req.query.q.toLowerCase()) !== -1 ||
        user.email.toLowerCase().indexOf(req.query.q.toLowerCase()) !== -1
    );
  }

  // Pagination
  let result;
  if (req.query.page) {
    result = calPagination(req.query.page, req.query.perPage, filtered);
  }

  if (result) {
    res.json({
      users: result.filtered,
      pagination: result.pagination,
    });
  } else {
    res.json({
      users: filtered,
    });
  }
};

// Show user
module.exports.view = async (req, res) => {
  try {
    var user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ errors: ['User not found'] });
    }

    var transactions = await Transaction.find({ user: req.params.id })
      .sort('-date')
      .populate({ path: 'books', select: 'title' });

    res.json({ user, transactions: transactions.slice(0, 10) });
  } catch (error) {
    return res.status(404).json({ errors: ['User not found'] });
  }
};

// Add user
module.exports.add = async (req, res) => {
  var newUser = req.body;

  newUser.password = await bcrypt.hash(newUser.password, 10);

  var user = await User.create(newUser);

  res.json(user);
};

// Edit user
module.exports.edit = async (req, res) => {
  var user = req.user;

  for (let x in req.body) {
    user[x] = req.body[x];
  }

  await user.save();

  res.json(user);
};

// Change password user
module.exports.changePassword = async (req, res) => {
  try {
    var user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ errors: ['User not found'] });
    }

    user.password = await bcrypt.hash(req.body.password, 10);

    await user.save();

    res.json({ msg: `Password changed for user: ${user.email}` });
  } catch (error) {
    return res.status(404).json({ errors: ['User not found'] });
  }
};

// Delete user
module.exports.deleteUser = async (req, res) => {
  try {
    var user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ errors: ['User not found'] });
    }

    await user.remove();

    // Also remove user's transactions
    await Transaction.deleteMany({ user: req.params.id });

    // Also remove user's cart
    await CartSession.findOneAndDelete({ user: req.params.id });

    res.json({});
  } catch (error) {
    return res.status(404).json({ errors: ['User not found'] });
  }
};
