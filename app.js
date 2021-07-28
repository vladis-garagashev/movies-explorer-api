const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const routes = require('./routes/index');
const centralErrorsHandler = require('./middlewares/central-errors-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 5000 } = process.env;
const {
  NODE_ENV,
  MONGO_URL,
  mongooseConfig,
  rateLimitConfig,
  corsConfig,
} = require('./config');

//-----------------------------------

const app = express();

app.use(requestLogger); // Подключаем логгер запросов
app.use(rateLimit(rateLimitConfig)); // Подключаем ограничитель количества запросов
app.use(helmet()); // Подключаем helmet
app.use(cors(corsConfig)); // Подключаем обработчик CORS
app.options('*', cors()); // Обрабатываем предварительные запросы
app.use(express.urlencoded({ extended: true })); // Парсинг веб-страниц внутри POST-запроса
app.use(express.json()); // Парсинг JSON данных
app.use(cookieParser()); // Подключаем cookieParser
app.use(routes); // Подключаем Роуты
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(centralErrorsHandler); // централизованный обработчик ошибок

//-----------------------------------

const start = async () => {
  try {
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`App listening on port ${PORT} is on ${NODE_ENV}`);
    });

    await mongoose.connect(MONGO_URL, mongooseConfig); // подключаемся к базе данных
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Init application error: ${error}`);
  }
};

start();
