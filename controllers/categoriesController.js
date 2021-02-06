const express = require('express');

const Category = require('../models/Category');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const categories = await Category.find({});
      return res.status(200).json({ categories });
    } catch (e) {
      next(e);
      return res.status(400).json(e);
    }
  },
};
