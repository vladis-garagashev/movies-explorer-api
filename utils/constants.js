const momgooLink = 'mongodb://localhost:27017/diplomadb';

const mongooseSettings = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

const linkRegExp = /^https?:\/\/(www\.)?\S*#?$/;

module.exports = {
  momgooLink,
  mongooseSettings,
  linkRegExp,
};
