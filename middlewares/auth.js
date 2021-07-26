const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');

const authError = () => {
  const error = new Error('Необходима авторизация');
  error.statusCode = 401;
  return error;
};

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    next(authError());
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(authError());
  }

  req.user = payload;
  next();
};
