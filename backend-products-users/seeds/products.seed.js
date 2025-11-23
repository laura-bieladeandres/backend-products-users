// seeds/products.seed.js
const mongoose = require("mongoose");
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

console.log("Cargando .env desde:", require("path").resolve(__dirname, "../.env"));
console.log("MONGO_URI:", process.env.MONGO_URI);

const Product = require("../models/Product.model");

const products = [
  {
    name: "Producto 1",
    description: "Descripción del producto 1",
    price: 10.99,
  },
  {
    name: "Producto 2",
    description: "Descripción del producto 2",
    price: 20.5,
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado para seed");

    await Product.deleteMany();
    console.log("Colección de productos borrada");

    await Product.insertMany(products);
    console.log("Productos insertados");

    await mongoose.disconnect();
    console.log("Desconectado");
  } catch (error) {
    console.error("Error ejecutando la semilla:", error);
    process.exit(1);
  }
};

seedProducts();
