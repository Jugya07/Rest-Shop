const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  productImg: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Product", productSchema);
