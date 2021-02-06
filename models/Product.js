const mongoose = require('mongoose');

// eslint-disable-next-line prefer-destructuring
const Schema = mongoose.Schema;

// Create product schema

const ProductSchema = new Schema({
  name: {
    type: String,
    maxlength: [255, 'El nombre debe tener como maximo 255 caracteres'],
    trim: true,
    required: true,
  },
  price: {
    type: Number,
    min: 1,
    required: true,
  },
  sku: {
    type: String,
    unique: true,
    required: false,
  },
  description: {
    type: String,
    required: true,
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories',
  }],
  status: {
    type: String,
    enum: ['pendiente', 'en_stock', 'activo'],
    default: 'pendiente',
  },
  delete: {
    type: Boolean,
    required: true,
  },
  sales: {
    type: Number,
    required: false,
  }
});

module.exports = Product = mongoose.model('products', ProductSchema);
