const express = require('express');
const bcrypt = require('bcryptjs');

const {
  validateRegisterInput,
} = require('../validation/users');
const User = require('../models/User');

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
};
