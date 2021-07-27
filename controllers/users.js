const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NotFoundError = require('../errors/not-found-err');

const User = require('../models/user');

//-----------------------------------

// Отправка запроса авторизации
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });

      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send({
          email: user.email,
          name: user.name,
          _id: user._id,
        });
    })
    .catch((error) => {
      if (error.message === 'Unauthorized') {
        const newError = new Error('Неправильные почта или пароль');
        newError.statusCode = 401;
        next(newError);
      }
      next(error);
    });
};

//-----------------------------------

// Выход из аккаунта
const signout = (req, res, next) => {
  try {
    res
      .clearCookie('jwt')
      .send({ message: 'Токен удален' });
  } catch (error) {
    next(error);
  }
};

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
  login,
  signout,
  createUser,
  getCurrentUser,
  edutCurrentUserInfo,
};
