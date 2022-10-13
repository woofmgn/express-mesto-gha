const User = require('../models/user');

const {
  ERROR_CODE_INCORRECT_DATA,
  ERROR_CODE_DATA_NOT_FOUND,
  ERROR_CODE_DEFAULT,
} = require('../utills/utills');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(ERROR_CODE_DEFAULT).send({ message: `Произошла ошибка: ${err.message}` }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(ERROR_CODE_DATA_NOT_FOUND).send({ message: `Запрашиваемый пользователь не найден, произошла ошибка: ${err.message}` });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_INCORRECT_DATA).send({ message: `Введен не верный id пользователя, произошла ошибка: ${err.message}` });
        return;
      }
      res.status(ERROR_CODE_DEFAULT).send({ message: `Произошла ошибка: ${err.message}` });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_INCORRECT_DATA).send({ message: `Введены не корректные данные, произошла ошибка: ${err.message}` });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.editUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true })
    .orFail(new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(ERROR_CODE_DATA_NOT_FOUND).send({ message: `Запрашиваемый пользователь не найден, произошла ошибка: ${err.message}` });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_INCORRECT_DATA).send({ message: `Введены не корректные данные, произошла ошибка: ${err.message}` });
        return;
      }
      res.send(`Произошла ошибка: ${err.message}`);
    });
};
