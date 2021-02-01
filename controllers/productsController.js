const express = require('express');
const Product = require('../models/Product');
const Category = require('../models/Category');

module.exports = {
  getAll: async (req, res, next) => {
    try{
      let queryFind = {};
      if(req.query.buscar) {
        queryFind={name: {$regex: `.*${req.query.buscar}.*`, $options: 'i'}};
      }
      if(req.query.categories) {
        queryFind={'categories': {$in: req.query.categories}};
      }
      const products = await Product.find(queryFind)
        .populate( "categories", "-_id name");
      if(!products[0]) return res.status(404).json({'error': 'products not found'});
      return res.status(200).json({products:products});
    } catch(e) {
      //next(e);
      return res.status(400).json({'error': e});
    }
  },
  create: async (req, res, next) => {
    let category;
    try{
      category = await Category.findByIdAndValidate(req.body.category);
      if(category.error) { return res.status(200).json(category);}
    } catch(e) {
      return res.status(200).json(e);
    }
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      status: req.body.status,
      delete: false,
      sales: 0,
    });
    product.categories.push(category._id);
    try {
      await product.save();
      return res.status(200).json({'created product': product});
    } catch(e) {
      return res.status(400).json(e.message);
    }
  },
  getById: async (req, res, next) => {
      Product.findById(req.params.id)
        .populate( "categories", "-_id name")
        .exec((err, product) => {
          if(err) return res.status(400).json({ error: err });
          return res.status(200).json({ product: product})
        });
  },
  getByTags: async(req,res,next) => {
      Product.findOne({'tags._id':req.params.id})
        .populate( "categories", "-_id name")
        .exec((err, product) => {
          if(err) return res.status(400).json({ error: err });
          return res.status(200).json({ product: product})
        });
  },
}

