const Card = require('../models/card');

const {
  ERROR_CODE_INCORRECT_DATA,
  ERROR_CODE_DATA_NOT_FOUND,
  ERROR_CODE_DEFAULT,
} = require('../utills/utills');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(ERROR_CODE_DEFAULT).send({ message: `Произошла ошибка: ${err.message}` }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link })
    .orFail(new Error('NotFound'))
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_INCORRECT_DATA).send({ message: `Введены не корректные данные, произошла ошибка: ${err.message}` });
        return;
      }
      if (err.name === 'NotFound') {
        res.status(ERROR_CODE_DATA_NOT_FOUND).send({ message: `Карточка не найдена, произошла ошибка: ${err.message}` });
        return;
      }
      res.status(ERROR_CODE_DEFAULT).send({ message: `Произошла ошибка: ${err.message}` });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('NotFound'))
    .then((card) => res.send({ message: `Карточка ${card} удалена` }))
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(ERROR_CODE_DATA_NOT_FOUND).send({ message: `Карточка не найдена, произошла ошибка: ${err.message}` });
        return;
      }
      res.status(ERROR_CODE_DEFAULT).send({ message: `Ошибка ${err.message}` });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new Error('NotFound'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_INCORRECT_DATA).send({ message: `Введены не корректные данные, произошла ошибка: ${err.message}` });
        return;
      }
      if (err.name === 'NotFound') {
        res.status(ERROR_CODE_DATA_NOT_FOUND).send({ message: `Карточка не найдена, произошла ошибка: ${err.message}` });
        return;
      }
      res.send({ message: `Произошла ошибка ${err.message}` });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new Error('NotFound'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_INCORRECT_DATA).send({ message: `Введены не корректные данные, произошла ошибка: ${err.message}` });
        return;
      }
      if (err.name === 'NotFound') {
        res.status(ERROR_CODE_DATA_NOT_FOUND).send({ message: `Карточка не найдена, произошла ошибка: ${err.message}` });
        return;
      }
      res.send({ message: `Произошла ошибка ${err.message}` });
    });
};
