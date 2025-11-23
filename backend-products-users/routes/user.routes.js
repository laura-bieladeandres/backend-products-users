// routes/user.routes.js 
const express = require("express");
const router = express.Router();

// Controladores
const {
  testToken,
  registerUser,
  loginUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
  toggleFavorite,
  getFavorites,
} = require("../controllers/user.controller");

// Middlewares
const upload = require("../middlewares/upload.middleware");
const auth = require("../middlewares/auth.middleware");
const { checkRole } = require("../middlewares/role.middleware");

// Registro (POST)
router.post("/register", upload.single("image"), registerUser);

// Login (POST)
router.post("/login", loginUser);

// Test token (GET)
router.get("/test-token", testToken);

// Ruta protegida básica
router.get("/profile", auth, (req, res) => {
  res.json({ message: "Ruta protegida OK", userData: req.user });
});

// Test admin (GET)
router.get("/test-admin", auth, checkRole("admin"), (req, res) => {
  res.json({ message: "Acceso permitido SOLO a admin" });
});

// CRUD USUARIOS

// GET ALL USERS (solo admin)
router.get("/", auth, checkRole("admin"), getAllUsers);

// GET USER BY ID (admin o él mismo)
router.get("/:id", auth, getUserById);

// PUT UPDATE USER (admin o él mismo)
router.put("/:id", auth, upload.single("image"), updateUser);

// DELETE USER (admin o él mismo)
router.delete("/:id", auth, deleteUser);

// FAVORITOS

// Añadir / quitar (toggle)
router.post("/:id/favorites/:productId", auth, toggleFavorite);

// Obtener favoritos
router.get("/:id/favorites", auth, getFavorites);

// CAMBIAR ROL (solo admin)
router.put("/:id/role", auth, checkRole("admin"), async (req, res, next) => {
  try {
    const { role } = req.body; // "user" o "admin"
    const userId = req.params.id;

    const user = await require("../models/User.model").findById(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    user.role = role;
    await user.save();

    return res.status(200).json({ message: "Rol actualizado correctamente", user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
