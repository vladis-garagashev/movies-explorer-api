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
  mongooseSettings,
  allowedCors,
} = require('./utils/constants');
const {
  signupValidator,
  signinValidator,
} = require('./utils/celebrateValidator');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const centralErrorsHandler = require('./middlewares/centralErrorsHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/not-found-err');
//-----------------------------------

const app = express();

mongoose.connect(momgooLink, mongooseSettings); // подключаемся к базе данных

app.use(requestLogger); // подключаем логгер запросов
app.use(helmet()); // подключаем helmet

// подключаем ограничитель количества запросов
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));

// подключаем обработчик CORS
app.use(cors({
  origin: allowedCors,
  credentials: true,
}));
app.options('*', cors());

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

app.use(errorLogger); // подключаем логгер ошибок

//-----------------------------------

app.use(errors()); // обработчик ошибок celebrate
app.use(centralErrorsHandler); // централизованный обработчик ошибок

//-----------------------------------

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
