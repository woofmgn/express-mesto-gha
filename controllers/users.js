const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NotFoundError = require('../errors/notFoundError');
const IncorrectDataError = require('../errors/incorrectDataError');

const User = require('../models/user');
const EmailNotUniqueError = require('../errors/emailNotUniqeError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден, произошла ошибка');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectDataError('Передан не верный id пользователя, произошла ошибка'));
      }
      next(err);
    });
};

module.exports.getMeUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => next(err));
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => res.send({
          name: user.name, about: user.about, avatar: user.avatar, email: user.email,
        }))
        .catch((err) => {
          if (err.code === 11000) {
            next(new EmailNotUniqueError('Такой пользователь уже существует, введите другой email'));
          }
          if (err.name === 'ValidationError') {
            next(new IncorrectDataError(`Переданы некорректные данные при создании пользователя, произошла ошибка: ${err.message}`));
          }
          next(err);
        });
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'Yandex-the-best', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => next(err));
};

module.exports.editUser = (req, res, next) => {
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
        next(new NotFoundError('Пользователь с указанным _id не найден, произошла ошибка'));
      }
      if (err.name === 'ValidationError') {
        next(new IncorrectDataError(`Переданы некорректные данные при обновлении профиля, произошла ошибка: ${err.message}`));
      }
      next(err);
    });
};

module.exports.editAvatar = (req, res, next) => {
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
        next(new NotFoundError('Пользователь с указанным _id не найден, произошла ошибка'));
      }
      if (err.name === 'ValidationError') {
        next(new IncorrectDataError(`Переданы некорректные данные при обновлении профиля, произошла ошибка: ${err.message}`));
      }
      next(err);
    });
};
