const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const {
  validateRegisterInput,
  validateLoginInput,
} = require('../validation/users');
const User = require('../models/User');
const keys = require('../config/keys');

module.exports = {
  // eslint-disable-next-line consistent-return
  register: async (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);
    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    User.findOne({ email: req.body.email }).then((user) => {
      if (user) {
        return res.status(400).json({ email: 'Email already exists' });
      }
      const newUser = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
      });
      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (error, hash) => {
          if (error) throw error;
          newUser.salt = salt;
          newUser.hashed_password = hash;
          newUser
            .save()
            .then((doc) => res.json(doc))
            .catch((er) => res.json(er));
        });
      });
    });
  },
  login: async (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const { email } = req.body;
    const { password } = req.body;

    User.findOne({ email }).then((user) => {
      if (!user) {
        return res.json({ emailnotfound: 'User not found!' });
      }
      bcrypt.compare(password, user.hashed_password).then((isMatch) => {
        if (isMatch) {
          const payload = {
            id: user.id,
            user: user.first_name,
          };
          // Sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: '5h',
            },
            (err, token) => {
              if (err) { return res.json({ error: 'User or password wrong' }); }
              res.json({
                success: true,
                token: `${token}`,
                expiresIn: '5h',
                first_name: user.first_name,
                last_name: user.last_name,
              });
            },
          );
        } else {
          return res.json({ error: 'User or password wrong' });
        }
      });
    }).catch((err) => res.json({ err }));
  },
  profile: (req, res) => {
    return res.status(200).json(req.user);
  },
};
