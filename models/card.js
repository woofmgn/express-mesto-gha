const mongoose = require('mongoose');

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

module.exports = mongoose.model('card', cardSchema);
