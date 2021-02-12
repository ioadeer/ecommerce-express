/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  first_name: {
    type: String,
    trim: true,
  },
  last_name: {
    type: String,
    trim: true,
  },
  user_name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    unique: 'Email already exists!',
    // eslint-disable-next-line no-useless-escape
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    required: 'Email is required!',
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
  hashed_password: {
    type: String,
    required: 'Password is required',
  },
  salt: String,
});

const User = mongoose.model('users', UserSchema);

module.exports = User;
