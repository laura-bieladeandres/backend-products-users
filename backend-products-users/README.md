README – Backend Products & Users

Este proyecto es una API creada con Node.js, Express y MongoDB. Permite gestionar usuarios y productos, además de que cada usuario pueda guardar productos como favoritos. También incluye autenticación con JWT, subida de imágenes a Cloudinary y control de permisos según el rol.

Tecnologías

Node.js
Express
MongoDB + Mongoose
Cloudinary
Multer
JWT
Bcrypt
Dotenv

Instalación
Clonar el repositorio
Instalar dependencias:
npm install
Crear el archivo .env con tus datos (el enunciado pide subirlo al repo):
PORT=4000
MONGO_URI=tu_url_mongo
JWT_SECRET=tu_secreto
CLOUDINARY_CLOUD_NAME=tu_nombre
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

Iniciar el servidor:
npm run dev

API disponible en:
http://localhost:4000

Modelos principales
.Usuario
.username
.email
.password (encriptada)
.role (por defecto “user”)
.imagen (Cloudinary)
.favoritos (array de IDs de productos)

El usuario admin se crea manualmente desde la base de datos.

Producto
.name
.description
.price

Endpoints principales
Usuarios
POST /api/users/register → registro
POST /api/users/login → login
GET /api/users → lista de usuarios (solo admin)
GET /api/users/:id → ver usuario
PUT /api/users/:id → editar usuario
DELETE /api/users/:id → eliminar usuario
POST /api/users/:id/favorites/:productId → añadir o quitar favorito
GET /api/users/:id/favorites → ver favoritos

Productos
POST /api/products (admin)
GET /api/products
GET /api/products/:id
PUT /api/products/:id (admin)
DELETE /api/products/:id (admin)

Seed
La carpeta seeds/ incluye una semilla para cargar productos de prueba:
node seeds/products.seed.js

Notas
Las imágenes se almacenan en Cloudinary y se eliminan al borrar el usuario.
Los roles están protegidos y el usuario normal no puede modificar el suyo.
Los favoritos funcionan como un “toggle” (si está, lo quita; si no está, lo añade).