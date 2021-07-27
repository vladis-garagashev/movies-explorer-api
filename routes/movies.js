const router = require('express').Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const {
  createMovieValidator,
  deleteMovieValidator,
} = require('../utils/celebrateValidator');

//-----------------------------------

router.get('/', getMovies);
router.post('/', createMovieValidator, createMovie);
router.delete('/:moviedId', deleteMovieValidator, deleteMovie);

//-----------------------------------

module.exports = router;
