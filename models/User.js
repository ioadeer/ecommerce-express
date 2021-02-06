/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const UserSchema = new Schema({
  frist_name: {
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

UserSchema
  .virtual('password')
  // eslint-disable-next-line func-names
  .set(function (password) {
    // eslint-disable-next-line no-underscore-dangle
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  // eslint-disable-next-line func-names
  .get(function () {
    // eslint-disable-next-line no-underscore-dangle
    return this._password;
  });

UserSchema.methods = {
  makeSalt: () => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) throw err;
      this.salt = salt;
    });
  },
  encryptPassword: (password) => {
    bcrypt.hash(password, this.salt, (err, hash) => {
      if (err) throw err;
      this.hashed_password = hash;
    });
  },
};

// eslint-disable-next-line no-unused-vars
UserSchema.path('hashed_password').validate((v) => {
  if (this._password && this._password.length < 6) {
    this.invalidate('password', 'Password must be at least 6 characters.');
  }
  if (this.isNew && !this._password) {
    this.invalidate('password', 'Password is required');
  }
});

module.exports = User =  mongoose.model('users', UserSchema);