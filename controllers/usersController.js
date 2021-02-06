const express = require('express');

const User = require('../models/User');

module.exports = {
  // eslint-disable-next-line consistent-return
  register: async (req, res) => {
    try {
      const newUser = new User({
        first_name: req.body.firts_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
      });
      newUser.save()
        .then((user) => res.status(200).json(user))
        .catch((err) => res.status(400).json(err));
    } catch (e) {
      return res.status(400).json(e);
    }
  },
}