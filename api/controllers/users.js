const bcrypt = require("bcrypt");
const calPagination = require("../../utils/pagination");
const User = require("../../models/User");

// Show all users
module.exports.index = async (req, res) => {
  var users = await User.find({ isAdmin: false });
  var filtered = [...users];

  if (req.query.q) {
    filtered = users.filter(
      user => user.name.toLowerCase().indexOf(req.query.q.toLowerCase()) !== -1
    );
  }

  // Pagination
  var result = calPagination(req.query.page, req.query.perPage, filtered);

  res.json({
    users: result.filtered,
    pagination: result.pagination
  });
};

// Show user
module.exports.view = async (req, res) => {
  try {
    var user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ errors: ["User not found"] });
    }

    res.json(user);
  } catch (error) {
    return res.status(404).json({ errors: ["User not found"] });
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
    if (x === "password") {
      user.password = await bcrypt.hash(req.body.password, 10);
    } else {
      user[x] = req.body[x];
    }
  }

  await user.save();

  res.json(user);
};

// Delete user
module.exports.deleteUser = async (req, res) => {
  try {
    var user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ errors: ["User not found"] });
    }

    await user.remove();
    res.json({});
  } catch (error) {
    return res.status(404).json({ errors: ["User not found"] });
  }
};
