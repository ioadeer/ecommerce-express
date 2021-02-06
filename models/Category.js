const mongoose = require('mongoose');

const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

CategorySchema.statics.findByIdAndValidate = async (id) => {
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

module.exports = Category = mongoose.model('categories', CategorySchema);
