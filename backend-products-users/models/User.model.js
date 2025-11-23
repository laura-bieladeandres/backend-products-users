// models/User.model.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Rol
    role: { type: String, enum: ["user", "admin"], default: "user" },

    // Imagen Cloudinary 
    image: {
      url: { type: String },
      public_id: { type: String }
    },

    // Array relacionado
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("User", userSchema);
