const Book = require("../../models/Book");

module.exports.add = (req, res, next) => {
  var errors = [];

  if (!req.body.title) {
    errors.push("Title is required");
  }

  if (!req.body.description) {
    errors.push("Description is required");
  }

  if (errors.length) {
    return res.status(400).json({ errors, values: req.body });
  }

  next();
};
