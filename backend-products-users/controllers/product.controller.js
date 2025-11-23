// controllers/product.controller.js
const Product = require("../models/Product.model");

// GET all products
const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    return next(error);
  }
};

// GET product by ID
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      const err = new Error("Product not found");
      err.status = 404;
      return next(err);
    }

    return res.status(200).json(product);
  } catch (error) {
    return next(error);
  }
};

// POST create (solo admin)
const createProduct = async (req, res, next) => {
  try {
    const newProduct = new Product(req.body);

    const savedProduct = await newProduct.save();
    return res.status(201).json(savedProduct);
  } catch (error) {
    return next(error);
  }
};

// PUT update (solo admin)
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      const err = new Error("Product not found");
      err.status = 404;
      return next(err);
    }

    return res.status(200).json(updated);
  } catch (error) {
    return next(error);
  }
};

// DELETE product (solo admin)
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      const err = new Error("Product not found");
      err.status = 404;
      return next(err);
    }

    return res.status(200).json("Product deleted");
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
