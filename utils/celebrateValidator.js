const { celebrate, Joi } = require('celebrate');
const { linkRegExp } = require('./constants');

const signupValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
});

const signinValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const createMovieValidator = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(linkRegExp).message('Вставьте ссылку на изображение'),
    trailer: Joi.string().required().pattern(linkRegExp).message('Вставьте ссылку на трейлер'),
    thumbnail: Joi.string().required().pattern(linkRegExp).message('Вставьте ссылку на миниатюру изображения'),
    movieId: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const deleteMovieValidator = celebrate({
  params: Joi.object().keys({
    moviedId: Joi.string().hex().length(24),
  }),
});

module.exports = {
  signupValidator,
  signinValidator,
  createMovieValidator,
  deleteMovieValidator,
};
