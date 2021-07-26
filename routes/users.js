const router = require('express').Router();

const {
  getCurrentUser,
  edutCurrentUserInfo,
} = require('../controllers/users');

//-----------------------------------

router.get('/me', getCurrentUser);

router.patch('/me', edutCurrentUserInfo);

//-----------------------------------

module.exports = router;
