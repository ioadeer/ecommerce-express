/* eslint-disable func-names */
const mongoose = require('mongoose');

// eslint-disable-next-line prefer-destructuring
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

CategorySchema.statics.findByIdAndValidate = async function (id) {
  try {
    const document = await this.findById(id);
    if (!document) {
      return {
        error: true,
        message: 'Category not found!',
      };
    }
    return document;
  } catch (e) {
    return e;
  }
};

// eslint-disable-next-line no-multi-assign
module.exports = Category = mongoose.model('categories', CategorySchema);
