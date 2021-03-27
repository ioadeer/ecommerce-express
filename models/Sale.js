/* eslint-disable func-names */
const mongoose = require('mongoose');

// eslint-disable-next-line prefer-destructuring
const Schema = mongoose.Schema;

const SaleSchema = new Schema({
  user: {
    _id: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    first_name: String,
    last_name: String,
    email: String,
  },
  product: {
    name: String,
    price: Number,
    description: String,
    cantidad: Number,
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products',
    },
    categories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'categories',
    }],
  },
  status: {
    type: String,
    enum: ['confirmada', 'no_confirmada'],
    default: 'no_confirmada',
  },
  payment: {
    method: {
      type: String,
      enum: [
        'MercadoPago', 
        'tarjeta_credito',
        'transferencia', 
        'efectivo',
        'a_convenir',
      ]
      , default: 'a_convenir',
    },
    status: {
      type: String,
      enum: ['pendiente','approved', 'rejected'],
      default: 'pendiente',
    },
    amount: Number,
    total: Number,
  },
});

const Sale = mongoose.model('sales', SaleSchema);

module.exports = Sale;
