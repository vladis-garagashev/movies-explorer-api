const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;
const validator = require('validator');

const { inValidIdMessage } = require('../utils/constants');

const signupValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().message('Поле "email" должно соответствовать email-адресу')
      .messages({
        'any.required': 'Поле "email" обязательное',
      }),
    password: Joi.string().required()
      .messages({
        'any.required': 'Поле "password" обязательное',
      }),
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина поля "name" - 2',
        'string.max': 'Максимальная длина поля "name" - 30',
        'any.required': 'Поле "name" обязательное',
      }),
  }),
});

const signinValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().message('Поле "email" должно соответствовать email-адресу')
      .messages({
        'any.required': 'Поле "email" обязательное',
      }),
    password: Joi.string().required()
      .messages({
        'any.required': 'Поле "password" обязательное',
      }),
  }),
});

const editCurrentUserInfoValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().message('Поле "email" должно соответствовать email-адресу')
      .messages({
        'any.required': 'Поле "email" обязательное',
      }),
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина поля "name" - 2',
        'string.max': 'Максимальная длина поля "name" - 30',
        'any.required': 'Поле "name" обязательное',
      }),
  }),
});

const createMovieValidator = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required()
      .messages({
        'any.required': 'Поле "country" обязательное',
      }),
    director: Joi.string().required()
      .messages({
        'any.required': 'Поле "director" обязательное',
      }),
    duration: Joi.number().required()
      .messages({
        'any.required': 'Поле "duration" обязательное',
      }),
    year: Joi.string().required()
      .messages({
        'any.required': 'Поле "year" обязательное',
      }),
    description: Joi.string().required()
      .messages({
        'any.required': 'Поле "description" обязательное',
      }),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле "image" должно быть валидным url');
    })
      .messages({
        'any.required': 'Поле "image" обязательное',
      }),
    trailer: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле "trailer" должно быть валидным url');
    })
      .messages({
        'any.required': 'Поле "trailer" обязательное',
      }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле "thumbnail" должно быть валидным url');
    })
      .messages({
        'any.required': 'Поле "thumbnail" обязательное',
      }),
    movieId: Joi.string().required().custom((value, helpers) => {
      if (validator.isDecimal(value)) {
        return value;
      }
      return helpers.message('Поле "movieId" должно быть десятичным числом');
    })
      .messages({
        'any.required': 'Поле "movieId" обязательное',
      }),
    nameRU: Joi.string().required()
      .messages({
        'any.required': 'Поле "nameRU" обязательное',
      }),
    nameEN: Joi.string().required()
      .messages({
        'any.required': 'Поле "nameEN" обязательное',
      }),
  }),
});

const ObjectIdValidator = celebrate({
  params: Joi.object().keys({
    moviedId: Joi.string().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message(inValidIdMessage);
    }),
  }),
});

module.exports = {
  signupValidator,
  signinValidator,
  editCurrentUserInfoValidator,
  createMovieValidator,
  ObjectIdValidator,
};
