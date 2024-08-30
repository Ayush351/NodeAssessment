const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  isVisible: {
    type: Boolean,
    default: true,
  }
});

module.exports = mongoose.model('Product', ProductSchema);
