const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

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
  Movie.findById(req.params.moviedId)
    .orFail(new NotFoundError('Нет карточки с таким _id'))
    .then((movie) => {
      if (req.user._id !== movie.owner.toString()) {
        throw new ForbiddenError('Вы не можете удалить эту карточку');
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
  getMoviesCards,
  createMovieCard,
  deleteMovieCard,
};
