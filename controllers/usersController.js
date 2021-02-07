const express = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

module.exports = {
  // eslint-disable-next-line consistent-return
  register: async (req, res) => {
    const { password } = req.body;
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
        bcrypt.hash(password, salt, (error, hash) => {
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
