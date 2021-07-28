const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const BadRequestError = require('../errors/bad-request-err');

const Movie = require('../models/movie');

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
      next(new BadRequestError(`${Object.values(error.errors).map((err) => err.message).join(', ')}`));
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
      next(new NotFoundError('Нет фильма с таким _id'));
      return;
    }

    if (req.user._id !== movie.owner.toString()) {
      next(new ForbiddenError('Вы не можете удалить этот фильм'));
      return;
    }

    await Movie.deleteOne({ _id: movie._id });

    res.send({ message: 'Фильм удален' });
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError('Не валидный _id'));
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
