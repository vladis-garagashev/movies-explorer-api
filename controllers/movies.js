const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const BadRequestError = require('../errors/bad-request-err');

const Movie = require('../models/movie');
const {
  bodyBadRequestMessage,
  movieNotFoundMessage,
  movieDeletionForbiddenMessage,
  movieDeletedMessage,
  inValidIdMessage,
} = require('../utils/constants');
//-----------------------------------

// Получаем все карточки
const getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user._id });
    res.send(movies);
  } catch (error) {
    next(error);
  }
};

//-----------------------------------

// Создаем новую карточку с фильмом
const createMovie = async (req, res, next) => {
  try {
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

    const movie = await Movie.create({
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
    });
    res.send(movie);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError(bodyBadRequestMessage(error)));
      return;
    }
    next(error);
  }
};

//-----------------------------------

// Удаляем карточку с фильмом
const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.moviedId);

    if (!movie) {
      next(new NotFoundError(movieNotFoundMessage));
      return;
    }

    if (req.user._id !== movie.owner.toString()) {
      next(new ForbiddenError(movieDeletionForbiddenMessage));
      return;
    }

    await Movie.deleteOne({ _id: movie._id });

    res.send({ message: movieDeletedMessage });
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError(inValidIdMessage));
      return;
    }
    next(error);
  }
};

//-----------------------------------

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
