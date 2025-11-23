// models/Product.model.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
