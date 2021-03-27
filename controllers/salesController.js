const express = require('express');

const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Category = require('../models/Category');

module.exports = {
  checkOut: async (req, res) => {
    // get product
    // create sale without confirm
    const user= req.user;
    let amount;
    let product;
    if(req.body.amount) {
      amount = parseInt(req.body.amount); 
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
      return res.status(200).json({ 'checkout': sale});
    });
  },
  getSellById: async (req, res) => {
    const id = req.params.id;
    console.log(id);
    Sale.findById(id, function(err, sale) {
      if(err) return res.status(400).json(err);
      if(req.user.id != sale.user._id){
        console.log('if');
        return res.status(403).json({ message: 'Forbidden' });
      }
      return res.status(200).json({sale: sale});
    });
  }
};
