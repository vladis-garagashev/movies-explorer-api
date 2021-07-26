const bcrypt = require('bcryptjs');
const NotFoundError = require('../errors/not-found-err');

const User = require('../models/user');

//-----------------------------------

// Создаем нового пользователя
const createUser = (req, res, next) => {
  const { email, name } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => {
      res.send({
        email: user.email,
        name: user.name,
        _id: user._id,
      });
    })
    .catch((error) => {
      if (error.name === 'MongoError' && error.code === 11000) {
        const newError = new Error('Пользователь с данным email существует');
        newError.statusCode = 409;
        next(newError);
      }
      next(error);
    });
};

//-----------------------------------

// Находим информацию о текущем пользователе
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Нет пользователя с таким _id'))
    .then((user) => res.send(user))
    .catch(next);
};
//-----------------------------------

// Редактируем информацию о пользователе
const edutCurrentUserInfo = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(new NotFoundError('Нет пользователя с таким _id'))
    .then((user) => res.send(user))
    .catch(next);
};

//-----------------------------------

module.exports = {
  createUser,
  getCurrentUser,
  edutCurrentUserInfo,
};
