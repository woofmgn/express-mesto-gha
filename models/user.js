const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minlength: [2, 'Минимальная длина - 2 символа'],
    maxlength: [30, 'Максимальная длина - 30 символов'],
  },
  about: {
    type: String,
    require: true,
    minlength: [2, 'Минимальная длина - 2 символа'],
    maxlength: [30, 'Максимальная длина - 30 символов'],
  },
  avatar: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model('user', userSchema);
