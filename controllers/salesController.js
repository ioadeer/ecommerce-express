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
        _id: product._id,
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
  },
  confirmPurchase: async (req, res) => {
    const id =req.body._id;
    Sale.findById(id, function(err, sale) {
      if(err) return res.status(400).json(err);
      sale.status = "confirmada";
      sale.payment.method = req.body.payment.method;
      if(req.user.id != sale.user._id){
        console.log('if');
        return res.status(403).json({ message: 'Forbidden' });
      }
      sale.save(function(error, confirmed) {
        if(error) {
          return res.status(400).json({error: err});
        }
        //update product
        Product.findById(confirmed.product._id, function(err, prod) {
          if(err) return console.log(err);
          prod.sales += confirmed.payment.amount;
          prod.save(function(err, prodUpdated) {
            if(err) console.log('could not update product');
          });
        });
        return res.status(200).json({'confirmed': confirmed});
      });
    });
  },
  getUsersPurchases: async (req, res) => {
    const id =req.user._id;
    try {
      const sales = await Sale.find({ 'user._id' : id});
      return res.status(200).json({'sales': sales});
    } catch(e) {
     return res.status(404).json({'error': e});
    }
  },
};
