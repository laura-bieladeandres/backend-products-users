// controllers/user.controller.js
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");
const cloudinary = require("../utils/cloudinary");

// Subir buffer a cloudinary
const uploadBufferToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "users" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// Registro de usuario 
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Ese email ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let image = {};

    if (req.file) {
      const uploaded = await uploadBufferToCloudinary(req.file.buffer);
      image = {
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
      };
    }

    let userRole = "user";
    if (role === "admin" && req.user?.role === "admin") {
      userRole = "admin";
    }

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: userRole,
      image,
    });

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        image: newUser.image?.url,
        role: newUser.role,
      },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error al registrar usuario",
      error,
    });
  }
};

// Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "El usuario no existe" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: "Login correcto",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        image: user.image?.url,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en login", error });
  }
};

// Get all users (solo admin)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json(users);
  } catch (error) {
    return next(error);
  }
};

// Get user by ID (admin o él mismo) 
const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;

    if (req.user.id !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        message: "No tienes permisos para ver este usuario",
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).json(user);

  } catch (error) {
    return next(error);
  }
};

// Update user (admin o él mismo)
const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    if (req.user.id !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        message: "No tienes permisos para editar este usuario",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    // Actualizar campos
    if (req.body.username) user.username = req.body.username;
    if (req.body.email) user.email = req.body.email;

    // Nueva imagen
    if (req.file) {
      if (user.image?.public_id) {
        await cloudinary.uploader.destroy(user.image.public_id);
      }

      const uploaded = await uploadBufferToCloudinary(req.file.buffer);
      user.image = {
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
      };
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      message: "Usuario actualizado correctamente",
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        image: updatedUser.image,
        role: updatedUser.role,
      },
    });

  } catch (error) {
    return next(error);
  }
};

// Test token 
const testToken = (req, res) => {
  res.json({ message: "Token válido" });
};

// Delete user 
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (req.user.id !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        message: "No tienes permisos para esta acción",
      });
    }

    const userToDelete = await User.findById(userId);

    if (!userToDelete) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (userToDelete.image?.public_id) {
      try {
        await cloudinary.uploader.destroy(userToDelete.image.public_id);
      } catch (err) {
        console.error("Error borrando imagen Cloudinary:", err.message);
      }
    }

    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      message: "Usuario eliminado correctamente",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error al eliminar usuario",
      error,
    });
  }
};

// Favoritos (add / remove) sin duplicados 
const toggleFavorite = async (req, res) => {
  try {
    const userId = req.params.id;
    const productId = req.params.productId;

    if (req.user.id !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        message: "No tienes permisos para modificar favoritos",
      });
    }

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const index = user.favorites.indexOf(productId);

    if (index === -1) {
      user.favorites.push(productId);
      await user.save();
      return res.status(200).json({
        message: "Producto añadido a favoritos",
        favorites: user.favorites,
      });
    } else {
      user.favorites.splice(index, 1);
      await user.save();
      return res.status(200).json({
        message: "Producto eliminado de favoritos",
        favorites: user.favorites,
      });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error al manejar favoritos",
      error,
    });
  }
};

// Obtener favoritos 
const getFavorites = async (req, res) => {
  try {
    const userId = req.params.id;

    if (req.user.id !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        message: "No tienes permisos",
      });
    }

    const user = await User.findById(userId).populate("favorites");

    return res.status(200).json(user.favorites);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error al obtener favoritos",
      error,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  testToken,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
  toggleFavorite,
  getFavorites,
};
