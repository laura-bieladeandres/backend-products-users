require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
const userRoutes = require("./routes/user.routes.js");
const productRoutes = require("./routes/product.routes.js");
app.use("/products", productRoutes);

app.use("/api/users", userRoutes);


// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente ✔️");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Conectado a MongoDB ✔️");
  })
  .catch((error) => {
    console.log("Error conectando a MongoDB ❌", error);
  });
// Puerto 4000
const PORT = process.env.PORT || 4000;
// Arranque del servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
