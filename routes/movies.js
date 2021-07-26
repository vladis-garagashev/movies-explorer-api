const router = require('express').Router();

const {
  getMoviesCards,
  createMovieCard,
  deleteMovieCard,
} = require('../controllers/movies');

//-----------------------------------

router.get('/', getMoviesCards);

router.post('/', createMovieCard);

router.delete('/:moviedId', deleteMovieCard);

//-----------------------------------

module.exports = router;
