const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

const Movie = require('../models/movie');

//-----------------------------------

// Получаем все карточки
const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .populate('user')
    .then((cards) => res.send(cards))
    .catch(next);
};

//-----------------------------------

// Создаем новую карточку с фильмом
const createMovie = (req, res, next) => {
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
    .catch(next);
};

//-----------------------------------

// Удаляем карточку с фильмом
const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.moviedId)
    .orFail(new NotFoundError('Нет карточки с таким _id'))
    .then((movie) => {
      if (req.user._id !== movie.owner.toString()) {
        throw new ForbiddenError('Вы не можете удалить этот фильм');
      }
      return movie;
    })
    .then((movie) => {
      Movie.deleteOne({ _id: movie._id })
        .then(() => res.send({ message: 'Фильм удален' }))
        .catch(next);
    })
    .catch(next);
};

//-----------------------------------

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
