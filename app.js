require('dotenv').config();

const { PORT = 5000 } = process.env;
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const {
  momgooLink,
  mongooseConfig,
  rateLimitConfig,
  corsConfig,
} = require('./utils/constants');
const {
  signupValidator,
  signinValidator,
} = require('./utils/celebrateValidator');
const { login, signout, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const centralErrorsHandler = require('./middlewares/centralErrorsHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/not-found-err');
//-----------------------------------

const app = express();

mongoose.connect(momgooLink, mongooseConfig); // подключаемся к базе данных

app.use(requestLogger); // подключаем логгер запросов
app.use(helmet()); // подключаем helmet
app.use(rateLimit(rateLimitConfig)); // подключаем ограничитель количества запросов
app.use(cors(corsConfig)); // подключаем обработчик CORS
app.options('*', cors()); // обрабатываем предварительные запросы

// Парсинг данных
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser()); // подключаем cookieParser

//-----------------------------------

app.post('/signup', signupValidator, createUser);
app.post('/signin', signinValidator, login);

app.use('/users', auth, require('./routes/users'));
app.use('/movies', auth, require('./routes/movies'));

// Обработчик запросов на неизвестные роуты
app.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.post('/signout', auth, signout);

//-----------------------------------

app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(centralErrorsHandler); // централизованный обработчик ошибок

//-----------------------------------

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
