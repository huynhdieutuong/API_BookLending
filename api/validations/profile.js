const User = require("../../models/User");
const bcrypt = require("bcrypt");

module.exports.avatar = (req, res, next) => {
  var errors = [];

  if (!req.file) {
    errors.push("Avatar is required");
  }

  if (errors.length) {
    return res.status(400).json({ errors });
  }

  next();
};

module.exports.password = async (req, res, next) => {
  var errors = [];

  if (!req.body.currentPassword) {
    errors.push("Current Password is required");
  } else {
    const user = await User.findById(req.user.id);

    // Check current password
    const isMatch = await bcrypt.compare(
      req.body.currentPassword,
      user.password
    );

    if (!isMatch) {
      errors.push("Current Password wrong");
    }
  }

  if (!req.body.password) {
    errors.push("Password is required");
  } else if (req.body.password.length < 6) {
    errors.push("Password must equal or more 6 chars");
  }

  if (!req.body.password2) {
    errors.push("Password Confirm is required");
  } else if (req.body.password !== req.body.password2) {
    errors.push("Password Confirm incorrect");
  }

  if (errors.length) {
    return res.status(400).json({ errors });
  }

  next();
};
