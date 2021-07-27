const momgooLink = 'mongodb://localhost:27017/diplomadb';

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

const linkRegExp = /^https?:\/\/(www\.)?\S*#?$/;

module.exports = {
  momgooLink,
  mongooseConfig,
  rateLimitConfig,
  corsConfig,
  linkRegExp,
};
