require('dotenv').config();

const { PORT = 5000, NODE_ENV } = process.env;
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const rateLimit = require('express-rate-limit');

const {
  momgooLink,
  mongooseSettings,
  linkRegExp,
} = require('./utils/constants');
//-----------------------------------

const app = express();

mongoose.connect(momgooLink, mongooseSettings); // подключаемся к базе данных

app.use(helmet()); // подключаем helmet

// подключаем ограничитель количества запросов
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));

// Парсинг данных
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser()); // подключаем cookieParser

//-----------------------------------

//-----------------------------------

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
