const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');

const { login, signout, createUser } = require('../controllers/users');
const { signupValidator, signinValidator } = require('../middlewares/celebrate-validator');
const NotFoundError = require('../errors/not-found-err');

router.post('/signup', signupValidator, createUser);
router.post('/signin', signinValidator, login);

router.use(auth);

router.post('/signout', signout);
router.use('/users', userRouter);
router.use('/movies', movieRouter);

// Обработчик запросов на неизвестные роуты
router.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
