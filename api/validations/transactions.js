module.exports.create = async (req, res, next) => {
  var errors = [];

  if (!req.body.user) {
    errors.push("Please select user");
  }

  if (!req.body.books) {
    errors.push("Please select books");
  }

  if (errors.length) {
    return res.status(400).json({ errors, values: req.body });
  }

  next();
};
