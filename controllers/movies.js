const NotFoundError = require('../errors/not-found-err');

const Movie = require('../models/movie');

//-----------------------------------

// Получаем все карточки
const getMoviesCards = (req, res, next) => {
  Movie.find({})
    .populate('user')
    .then((cards) => res.send(cards))
    .catch(next);
};

//-----------------------------------

// Создаем новую карточку с фильмом
const createMovieCard = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((error) => {
      if (error.errors.link) {
        const newError = new Error('Изображение должно быть ссылкой');
        newError.statusCode = 400;
        next(newError);
      }
      next(error);
    });
};

//-----------------------------------

// Удаляем карточку с фильмом
const deleteMovieCard = (req, res, next) => {
  Movie.deleteOne(req.params.movieId)
    .orFail(new NotFoundError('Нет фильма с таким _id'))
    .then(() => res.send({ message: 'Фильм удален' }))
    .catch(next);
};

//-----------------------------------

module.exports = {
  getMoviesCards,
  createMovieCard,
  deleteMovieCard,
};
