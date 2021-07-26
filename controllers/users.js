const NotFoundError = require('../errors/not-found-err');

const User = require('../models/user');

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
  getCurrentUser,
  edutCurrentUserInfo,
};
