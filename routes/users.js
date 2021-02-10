const express = require('express');
const passport = require('passport');

const router = express.Router();

const usersController = require('../controllers/usersController');

/* GET users listing. */
router
  // @route POST /users/register
  // @desc Register user
  // @access Public
  .post('/register', usersController.register)
  // @route POST /api/user/login
  // @desc Login user and return JWT
  // @acces Public
  .post('/login', usersController.login)
  .get('/profile', passport.authenticate('jwt', { session: false }), usersController.profile);

module.exports = router;
