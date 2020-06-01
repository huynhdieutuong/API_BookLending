const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;

// Index
module.exports.index = (req, res) => {
  res.json(req.user);
};

// Update profile
module.exports.update = async (req, res) => {
  var user = req.user;

  if (req.body) {
    if (req.body.name) {
      user.name = req.body.name;
    }

    if (req.body.phone) {
      user.phone = req.body.phone;
    }
    await user.save();
  }

  res.json(user);
};

// Update avatar
module.exports.avatar = async (req, res) => {
  var user = req.user;

  var result = await cloudinary.uploader.upload(req.file.path, {
    public_id: "BookManagement/Avatars/" + req.file.filename
  });

  user.avatarUrl = result.url;

  await user.save();

  res.json(user);
};

// Change password
module.exports.password = async (req, res) => {
  var user = req.user;

  user.password = await bcrypt.hash(req.body.password, 10);

  await user.save();

  res.json({ alert: "Password Changed" });
};
