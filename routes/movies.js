const router = require('express').Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const {
  createMovieValidator,
  ObjectIdValidator,
} = require('../middlewares/celebrateValidator');

//-----------------------------------

router.get('/', getMovies);
router.post('/', createMovieValidator, createMovie);
router.delete('/:moviedId', ObjectIdValidator, deleteMovie);

//-----------------------------------

module.exports = router;
