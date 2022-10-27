const cardRouter = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { validationCreateCard } = require('../middlewares/validationJoiCard');

cardRouter.use(auth);
cardRouter.get('/cards', getCards);
cardRouter.post('/cards', validationCreateCard, createCard);
cardRouter.delete('/cards/:cardId', deleteCard);
cardRouter.put('/cards/:cardId/likes', likeCard);
cardRouter.delete('/cards/:cardId/likes', dislikeCard);

module.exports = cardRouter;
