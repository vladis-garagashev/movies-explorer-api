const linkRegExp = /^https?:\/\/(www\.)?\S*#?$/;

const bodyBadRequestMessage = (error) => `${Object.values(error.errors).map((err) => err.message).join(', ')}`;

const emailIsExistrMessage = 'Пользователь с данным email существует';
const emailIsTakenMessage = 'Данный email уже занят';
const userNotFoundMessage = 'Нет пользователя с таким _id';
const movieNotFoundMessage = 'Нет фильма с таким _id';
const movieDeletionForbiddenMessage = 'Вы не можете удалить этот фильм';
const movieDeletedMessage = 'Фильм удален';
const inValidIdMessage = 'Не валидный _id';
const tokenDeletedMessage = 'Токен удален';
const notFoundMessage = 'Страница не найдена';

module.exports = {
  linkRegExp,
  emailIsExistrMessage,
  emailIsTakenMessage,
  bodyBadRequestMessage,
  userNotFoundMessage,
  movieNotFoundMessage,
  movieDeletionForbiddenMessage,
  movieDeletedMessage,
  inValidIdMessage,
  tokenDeletedMessage,
  notFoundMessage,
};
