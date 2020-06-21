const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../../models/User');

// Login
module.exports.login = (req, res) => {
  const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  res.json({ success: true, token });
};

// Login Social
module.exports.loginSocial = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });

  // If not user, create new user
  if (!user) {
    const newUser = {
      name: req.body.name,
      email: req.body.email,
      avatarUrl: req.body.avatarUrl,
    };

    user = await User.create(newUser);
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  res.json({ success: true, token });
};

// Register
module.exports.register = async (req, res) => {
  var newUser = req.body;

  newUser.password = await bcrypt.hash(newUser.password, 10);

  var user = await User.create(newUser);

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  res.json({ success: true, token });
};
