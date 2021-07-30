const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-error');
const BadRequestError = require('../errors/bad-request-err');

const User = require('../models/user');
const { JWT_SECRET } = require('../config');
const {
  bodyBadRequestMessage,
  emailIsExistrMessage,
  emailIsTakenMessage,
  userNotFoundMessage,
  tokenDeletedMessage,
} = require('../utils/constants');
//-----------------------------------

// Отправка запроса авторизации
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign(
      { _id: user._id },
      JWT_SECRET,
      { expiresIn: '7d' },
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
    if (error.name === 'ValidationError') {
      next(new BadRequestError(bodyBadRequestMessage(error)));
      return;
    }
    next(error);
  }
};

//-----------------------------------

// Выход из аккаунта
const signout = (req, res, next) => {
  try {
    res
      .clearCookie('jwt')
      .send({ message: tokenDeletedMessage });
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
      next(new ConflictError(emailIsExistrMessage));
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
    if (error.name === 'ValidationError') {
      next(new BadRequestError(bodyBadRequestMessage(error)));
      return;
    }
    next(error);
  }
};

//-----------------------------------

// Находим информацию о текущем пользователе
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      next(new NotFoundError(userNotFoundMessage));
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
    const { email, name } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      next(new NotFoundError(userNotFoundMessage));
      return;
    }

    const newUserData = await User.findByIdAndUpdate(
      req.user._id,
      { email, name },
      {
        new: true,
        runValidators: true,
        upsert: false,
      },
    );

    res.send(newUserData);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError(bodyBadRequestMessage(error)));
      return;
    }
    if (error.name === 'MongoError') {
      next(new ConflictError(emailIsTakenMessage));
      return;
    }
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
