const User = require("../../models/User");

module.exports.add = async (req, res, next) => {
  var errors = [];

  if (!req.body.email) {
    errors.push("Email is required");
  } else {
    var user = await User.findOne({ email: req.body.email }).select(
      "-password"
    );

    if (user) {
      errors.push("Email already used");
    }
  }

  if (!req.body.password) {
    errors.push("Password is required");
  } else if (req.body.password.length < 6) {
    errors.push("Password must equal or more 6 chars");
  }

  if (!req.body.name) {
    errors.push("Name is required");
  } else if (req.body.name.length > 30) {
    errors.push("Name is not over 30 chars");
  }

  if (!req.body.phone) {
    errors.push("Phone is required");
  }

  if (errors.length) {
    return res.status(400).json({ errors, values: req.body });
  }

  next();
};

module.exports.edit = async (req, res, next) => {
  try {
    var user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ errors: ["User not found"] });
    }

    var errors = [];

    if (req.body.email) {
      var existUser = await User.findOne({ email: req.body.email }).select(
        "-password"
      );

      if (existUser) {
        errors.push("Email already used");
      }
    }

    if (req.body.name && req.body.name.length > 30) {
      errors.push("Name is not over 30 chars");
    }

    if (errors.length) {
      return res.status(400).json({ errors, values: req.body });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(404).json({ errors: ["User not found"] });
  }
};
