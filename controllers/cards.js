const Card = require('../models/card');

const {
  ERROR_CODE_INCORRECT_DATA,
  ERROR_CODE_DATA_NOT_FOUND,
  ERROR_CODE_DEFAULT,
} = require('../utills/utills');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка: ${err.message}` }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link })
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка: ${err.message}` }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ message: `Карточка ${card} удалена` }))
    .catch((err) => res.send({ message: `Ошибка ${err.message}` }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => res.send(card))
    .catch((err) => res.send({ message: `Ошибка ${err.message}` }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => res.send(card))
    .catch((err) => res.send({ message: `Ошибка ${err.message}` }));
};
