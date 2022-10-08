const mongoose = require('mongoose');

const cardSchema = mongoose.Schema({
  name: {
    require: true,
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    require: true,
    type: String,
  },
  owner: {
    require: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  likes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    // default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('card', cardSchema);
