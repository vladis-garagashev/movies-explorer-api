const momgooLink = 'mongodb://localhost:27017/diplomadb';

const mongooseSettings = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

const allowedCors = [
  'https://findyourmovies.nomoredomains.club',
  'http://findyourmovies.nomoredomains.club',
  'http://localhost:3000',
];

const linkRegExp = /^https?:\/\/(www\.)?\S*#?$/;

module.exports = {
  momgooLink,
  mongooseSettings,
  allowedCors,
  linkRegExp,
};
