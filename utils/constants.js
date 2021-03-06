const bodyBadRequestMessage = (error) => `${Object.values(error.errors).map((err) => err.message).join(', ')}`;

const invalidUrldMessage = 'Страница не найдена';
const emailIsExistrMessage = 'Пользователь с данным email существует';
const emailIsTakenMessage = 'Данный email уже занят';
const userNotFoundMessage = 'Нет пользователя с таким _id';
const movieNotFoundMessage = 'Нет фильма с таким _id';
const movieDeletionForbiddenMessage = 'Вы не можете удалить этот фильм';
const movieDeletedMessage = 'Фильм удален';
const inValidIdMessage = 'Не валидный _id';
const loggedOutMessage = 'Вы вышли из системы';
const notFoundMessage = 'Страница не найдена';

module.exports = {
  invalidUrldMessage,
  emailIsExistrMessage,
  emailIsTakenMessage,
  bodyBadRequestMessage,
  userNotFoundMessage,
  movieNotFoundMessage,
  movieDeletionForbiddenMessage,
  movieDeletedMessage,
  inValidIdMessage,
  loggedOutMessage,
  notFoundMessage,
};
