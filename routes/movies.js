const router = require('express').Router();

const {
  getMoviesCards,
  createMovieCard,
  deleteMovieCard,
} = require('../controllers/movies');
const {
  createMovieValidator,
  deleteMovieValidator,
} = require('../utils/celebrateValidator');

//-----------------------------------

router.get('/', getMoviesCards);
router.post('/', createMovieValidator, createMovieCard);
router.delete('/:moviedId', deleteMovieValidator, deleteMovieCard);

//-----------------------------------

module.exports = router;
