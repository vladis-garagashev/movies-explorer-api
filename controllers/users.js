const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-error');

const User = require('../models/user');

//-----------------------------------

// Отправка запроса авторизации
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' },
    );

    res
      .cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
      .send({
        _id: user._id,
        email: user.email,
        name: user.name,
      });
  } catch (error) {
    next(error);
  }
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
const createUser = async (req, res, next) => {
  try {
    const { email, name } = req.body;

    const candidate = await User.findOne({ email });

    if (candidate) {
      next(new ConflictError('Пользователь с данным email существует'));
      return;
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
    });

    res.send({
      _id: user._id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    next(error);
  }
};

//-----------------------------------

// Находим информацию о текущем пользователе
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      next(new NotFoundError('Нет пользователя с таким _id'));
      return;
    }

    res.send(user);
  } catch (error) {
    next(error);
  }
};
//-----------------------------------

// Редактируем информацию о пользователе
const edutCurrentUserInfo = async (req, res, next) => {
  try {
    const { name } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      next(new NotFoundError('Нет пользователя с таким _id'));
      return;
    }

    const newUserData = await User.findByIdAndUpdate(
      req.user._id,
      { name },
      {
        new: true,
        runValidators: true,
        upsert: false,
      },
    );

    res.send(newUserData);
  } catch (error) {
    next(error);
  }
};

//-----------------------------------

module.exports = {
  login,
  signout,
  createUser,
  getCurrentUser,
  edutCurrentUserInfo,
};
