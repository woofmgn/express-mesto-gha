const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка: ${err.message}` }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  console.log(req.user._id);
  Card.create({ name, link })
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка: ${err.message}` }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ message: `Карточка ${card} удалена` }))
    .catch((err) => res.send({ message: `Ошибка ${err.message}` }));
};
