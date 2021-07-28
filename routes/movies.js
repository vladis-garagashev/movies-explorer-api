const router = require('express').Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const {
  createMovieValidator,
  ObjectIdValidator,
} = require('../middlewares/celebrate-validator');

//-----------------------------------

router.get('/', getMovies);
router.post('/', createMovieValidator, createMovie);
router.delete('/:moviedId', ObjectIdValidator, deleteMovie);

//-----------------------------------

module.exports = router;
