require('dotenv').config();

const {
  PORT = 5000,
  NODE_ENV = 'development',
  JWT_SECRET = 'JWT_SECRET',
  MONGO_URL = 'mongodb://localhost:27017/diplomadb',
} = process.env;

const mongooseConfig = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

const rateLimitConfig = {
  windowMs: 15 * 60 * 1000,
  max: 100,
};

const allowedCors = [
  'https://findyourmovies.nomoredomains.club',
  'http://findyourmovies.nomoredomains.club',
  'http://localhost:3000',
];

const corsConfig = {
  origin: allowedCors,
  credentials: true,
};

module.exports = {
  PORT,
  NODE_ENV,
  JWT_SECRET,
  MONGO_URL,
  mongooseConfig,
  rateLimitConfig,
  corsConfig,
};
