// middlewares/role.middleware.js

// Middleware para comprobar si el usuario tiene un rol permitido
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role;

      // Si no existe req.user o no trae role
      if (!userRole) {
        return res.status(401).json({
          message: "No se ha podido obtener el rol del usuario",
        });
      }

      // Comprobar si el rol del usuario está entre los permitidos
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          message: "No tienes permisos para esta acción",
        });
      }

      // Si todo está correcto, continuar
      next();

    } catch (error) {
      return res.status(500).json({
        message: "Error en el middleware de roles",
        error,
      });
    }
  };
};


const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      message: "No tienes permisos para esta acción (solo admin)",
    });
  }

  next();
};

module.exports = { checkRole, isAdmin };

module.exports = { checkRole, isAdmin };