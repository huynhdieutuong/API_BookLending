const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  wrongLoginCount: {
    type: Number,
    default: 0,
  },
  avatarUrl: {
    type: String,
    default:
      'https://res.cloudinary.com/dbu9wn1oz/image/upload/v1587877777/BookManagement/Avatars/f648dfdd0b3a85231de874e91f694070.png',
  },
});

module.exports = mongoose.model('User', userSchema);
