const { celebrate, Joi } = require('celebrate');
const { REGEX_URL } = require('../utills/utills');

module.exports.validationCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().pattern(REGEX_URL),
  }),
});

module.exports.validationCardId = celebrate({
  body: Joi.object().keys({
    _id: Joi.string().required().length(24),
  }),
});
