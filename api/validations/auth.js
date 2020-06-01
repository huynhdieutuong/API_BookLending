const bcrypt = require("bcrypt");
const sendEmail = require("../../utils/sendEmail");

const User = require("../../models/User");

module.exports.login = async (req, res, next) => {
  var errors = [];

  // Check empty email & password
  if (!req.body.email) {
    errors.push("Email is required");
  }
  if (!req.body.password) {
    errors.push("Password is required");
  }

  // Check user
  var user = await User.findOne({ email: req.body.email });
  if (!user) {
    errors.push("User doesn't exist");
    return res.status(400).json({ errors, values: req.body });
  }

  // If wrong login over 3 times
  if (user.wrongLoginCount >= 4) {
    user.wrongLoginCount += 1;
    await user.save();

    errors.push("Blocked account for wrong login over 3 times.");
    return res.status(400).json({ errors, values: req.body });
  }

  // Check password
  var result = await bcrypt.compare(req.body.password, user.password);
  if (!result) {
    user.wrongLoginCount += 1;
    await user.save();

    if (user.wrongLoginCount <= 3) {
      errors.push("Wrong password");
    } else {
      errors.push("Blocked account for wrong login over 3 times.");

      await sendEmail(user.email);

      return res.status(400).json({ errors, values: req.body });
    }
  }

  if (errors.length) {
    return res.status(400).json({ errors, values: req.body });
  }

  // Login success
  user.wrongLoginCount = 0;
  await user.save();

  req.user = user;

  next();
};

module.exports.register = async (req, res, next) => {
  var errors = [];

  // Check email
  if (!req.body.email) {
    errors.push("Email is required");
  } else {
    // Check unique email
    var user = await User.findOne({ email: req.body.email });
    if (user) {
      errors.push("Email already used");
    }
  }

  // Check password
  if (!req.body.password) {
    errors.push("Password is required");
  } else if (req.body.password.length < 6) {
    errors.push("Password must equal or more 6 chars");
  }

  // Check password confirm
  if (!req.body.password2) {
    errors.push("Password Confirm is required");
  } else if (req.body.password !== req.body.password2) {
    errors.push("Password Confirm wrong");
  }

  // Check name
  if (!req.body.name) {
    errors.push("Name is required");
  } else if (req.body.name.length > 30) {
    errors.push("Name is not over 30 chars");
  }

  // Check phone
  if (!req.body.phone) {
    errors.push("Phone is required");
  }

  if (errors.length) {
    return res.status(400).json({ errors, values: req.body });
  }

  next();
};
