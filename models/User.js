const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  wrongLoginCount: {
    type: Number,
    default: 0
  },
  avatarUrl: {
    type: String,
    default: "/uploads/avatars/f648dfdd0b3a85231de874e91f694070"
  }
});

module.exports = mongoose.model("User", userSchema);
