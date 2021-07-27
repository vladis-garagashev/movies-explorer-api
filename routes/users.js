const router = require('express').Router();

const {
  getCurrentUser,
  edutCurrentUserInfo,
} = require('../controllers/users');
const {
  editCurrentUserInfoValidator,
} = require('../utils/celebrateValidator');

//-----------------------------------

router.get('/me', getCurrentUser);

router.patch('/me', editCurrentUserInfoValidator, edutCurrentUserInfo);

//-----------------------------------

module.exports = router;
