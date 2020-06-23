const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fetch = require('node-fetch');

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
  const { method, userID, accessToken } = req.body;
  let data;

  // Facebook
  if (method === 'facebook') {
    try {
      const res = await fetch(
        `https://graph.facebook.com/${userID}?fields=name,email&access_token=${accessToken}`
      );

      data = await res.json();
      data.avatarUrl = `http://graph.facebook.com/${userID}/picture?type=large`;
    } catch (error) {
      console.log(error);
    }
  }

  // Google
  if (method === 'google') {
    try {
      const res = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`
      );

      data = await res.json();
      data.avatarUrl = data.picture;
    } catch (error) {
      console.log(error);
    }
  }

  let user = await User.findOne({ email: data.email });

  // If not user, create new user
  if (!user) {
    const newUser = {
      name: data.name,
      email: data.email,
      avatarUrl: data.avatarUrl,
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
