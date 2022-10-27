const mongoose = require('mongoose');
const { REGEX_URL } = require('../utills/utills');

const cardSchema = mongoose.Schema({
  name: {
    required: true,
    type: String,
    minlength: [2, 'длина названия должна быть не менее 2 символов'],
    maxlength: [30, 'длина названия должна быть не более 30 символов'],
  },
  link: {
    required: true,
    type: String,
  },
  owner: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

cardSchema.path('link').validate((val) => REGEX_URL.test(val), 'Invalid URL.');

module.exports = mongoose.model('card', cardSchema);
