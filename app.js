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

app.use(requestLogger); // Подключаем логгер запросов
app.use(helmet()); // Подключаем helmet
app.use(rateLimit(rateLimitConfig)); // Подключаем ограничитель количества запросов
app.use(cors(corsConfig)); // Подключаем обработчик CORS
app.options('*', cors()); // Обрабатываем предварительные запросы
app.use(express.urlencoded({ extended: true })); // Парсинг веб-страниц внутри POST-запроса
app.use(express.json()); // Парсинг JSON данных
app.use(cookieParser()); // Подключаем cookieParser

//-----------------------------------

app.post('/signup', signupValidator, createUser);
app.post('/signin', signinValidator, login);

app.post('/signout', auth, signout);
app.use('/users', auth, require('./routes/users'));
app.use('/movies', auth, require('./routes/movies'));

// Обработчик запросов на неизвестные роуты
app.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

//-----------------------------------

app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(centralErrorsHandler); // централизованный обработчик ошибок

//-----------------------------------

const start = async () => {
  try {
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`App listening on port ${PORT}`);
    });

    await mongoose.connect(momgooLink, mongooseConfig); // подключаемся к базе данных
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Init application error: ${error}`);
  }
};

start();
