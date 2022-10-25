const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const {
  ERROR_CODE_INCORRECT_DATA,
  ERROR_CODE_DATA_NOT_FOUND,
  ERROR_CODE_DEFAULT,
} = require('../utills/utills');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка' }));
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(ERROR_CODE_DATA_NOT_FOUND).send({
          message: 'Пользователь с указанным _id не найден, произошла ошибка',
        });
        return;
      }
      res.send(user);
      next();
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_INCORRECT_DATA).send({
          message: 'Передан не верный id пользователя, произошла ошибка',
        });
        return;
      }
      res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка' });
    });
};

module.exports.getMeUser = (req, res) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => ({ message: `!! ${err.message}` }));
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => res.send(user))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            res.status(ERROR_CODE_INCORRECT_DATA).send({
              message:
                `Переданы некорректные данные при создании пользователя, произошла ошибка: ${err.message}`,
            });
            return;
          }
          res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка' });
        });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'Yandex-the-best', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => res.status(ERROR_CODE_DATA_NOT_FOUND).send({ message: err.message }));
};

module.exports.editUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(ERROR_CODE_DATA_NOT_FOUND).send({
          message: 'Пользователь с указанным _id не найден, произошла ошибка',
        });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_INCORRECT_DATA).send({
          message:
            'Переданы некорректные данные при обновлении профиля, произошла ошибка',
        });
        return;
      }
      res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка' });
    });
};

module.exports.editAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(new Error('NotFound'))
    .then((userAvatar) => res.send(userAvatar))
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(ERROR_CODE_DATA_NOT_FOUND).send({
          message: 'Пользователь с указанным _id не найден, произошла ошибка',
        });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_INCORRECT_DATA).send({
          message:
            'Переданы некорректные данные при обновлении профиля, произошла ошибка',
        });
        return;
      }
      res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка' });
    });
};
