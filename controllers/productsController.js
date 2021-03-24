const express = require('express');

const Product = require('../models/Product');
const Category = require('../models/Category');
const Sale = require('../models/Sale');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      let queryFind = {};
      if (req.query.buscar) {
        queryFind = { name: { $regex: `.*${req.query.buscar}.*`, $options: 'i' } };
      }
      if (req.query.categories) {
        queryFind = { categories: { $in: req.query.categories } };
      }
      const products = await Product.find(queryFind)
        .populate('categories', '-_id name');
      if (!products[0]) return res.status(404).json({ error: 'products not found' });
      return res.status(200).json({ products });
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  },
  create: async (req, res, next) => {
    let category;
    try {
      category = await Category.findByIdAndValidate(req.body.category);
      if (category.error) { return res.status(200).json(category); }
    } catch (e) {
      return res.status(200).json(e);
    }
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      status: req.body.status,
      sku: req.body.sku,
      delete: false,
      sales: 0,
    });
    // eslint-disable-next-line no-underscore-dangle
    product.categories.push(category);
    try {
      await product.save();
      return res.status(200).json({ 'created product': product });
    } catch (e) {
      return res.status(400).json(e.message);
    }
  },
  delete: async (req, res, next) => {
    const { params } = req;
    const { id } = params;
    try {
      const product = await Product.findOneAndUpdate(
        { _id: id },
        { delete: true },
        { new: true },
      );
      return res.status(200).json({ 'Set product as deleted': product });
    } catch (error) {
      return res.status(400).json({ error });
    }
  },
  getById: async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id)
        .populate('categories', '-_id name');
      return res.status(200).json(product);
    } catch (e) {
      return res.status(400).json(e);
    }
  },
  getByTags: async (req, res, next) => {
    const { params } = req;
    const { id } = params;
    Product.findOne({ 'tags._id': id })
      .populate('categories', '-_id name')
      .exec((err, product) => {
        if (err) return res.status(400).json({ error: err });
        return res.status(200).json({ product });
      });
  },
  getTopFive: async (req, res) => {
    Product.find({})
      .sort({ sales: 'desc' })
      .limit(5)
      .exec((err, products) => {
        if (err) return res.status(400).json({ error: err });
        return res.status(200).json({ products });
      });
  },
  checkOut: async (req, res) => {
    // get product
    // create sale without confirm
    const user= req.user;
    console.log(user);
    let amount;
    let product;
    if(req.query.amount) {
      amount = parseInt(req.query.amount); 
    } else {
      amount = 1;
    }
    try {
      product = await Product.findById(req.params.id)
        .populate('categories', '_id -name');

    } catch (e) {
      return res.status(400).json(e);
    }
    const pending_sale = new Sale({
      user: {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
      product: {
        name: product.name,
        price: product.price,
        description: product.description,
        product_id: product._id,
      },
      status: 'no_confirmada',
      payment: {
        method: 'a_convenir',
        status: 'pendiente',
        amount: amount,
        total: product.price * amount,
      },
    });
    product.categories.map(cat => pending_sale.product.categories.push(cat._id));
    pending_sale.save(function(err, sale) {
      if(err) return res.status(400).json({error: err});
      return res.status(200).json({ 'created product': sale});
    });
  }
};
