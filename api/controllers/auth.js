const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../../models/User");

// Login
module.exports.login = (req, res) => {
  const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
    expiresIn: "1d"
  });

  res.json({ success: true, token });
};

// Register
module.exports.register = async (req, res) => {
  var newUser = req.body;

  newUser.password = await bcrypt.hash(newUser.password, 10);

  var user = await User.create(newUser);

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1d"
  });

  res.json({ success: true, token });
};