const jwt = require("jsonwebtoken");
const User = require("../../models/User");

module.exports.requiredAuth = async (req, res, next) => {
  var token;
  var auth = req.headers.authorization;

  if (auth && auth.startsWith("Bearer")) {
    token = auth.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ errors: ["Not authorize to access this route"] });
  }

  try {
    var decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ errors: ["Not authorize to access this route"] });
  }
};

module.exports.requiredAdmin = async (req, res, next) => {
  var token;
  var auth = req.headers.authorization;

  if (auth && auth.startsWith("Bearer")) {
    token = auth.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ errors: ["Not authorize to access this route"] });
  }

  try {
    var decoded = jwt.verify(token, process.env.JWT_SECRET);

    var user = await User.findById(decoded.id).select("-password");

    if (!user.isAdmin) {
      return res
        .status(401)
        .json({ errors: ["Not admin authorize to access this route"] });
    }

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ errors: ["Not authorize to access this route"] });
  }
};
