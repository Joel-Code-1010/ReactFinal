# Sistema de Gestión de Materiales y Reportes para Técnicos

## Descripción General
Este proyecto consiste en un sistema web diseñado para optimizar la gestión de materiales y reportes en una empresa de servicio técnico. Permite a los administradores gestionar usuarios y materiales, asignar recursos a los técnicos, y generar reportes detallados sobre el uso de materiales y desempeño. Los técnicos pueden registrar su uso de materiales y enviar reportes diarios.

titulo de ejemplo

## Tecnologías Utilizadas
- **Backend**: Node.js, Express.js
- **Base de Datos**: MongoDB
- **Autenticación y Autorización**: JSON Web Tokens (JWT)
- **Middleware**: Validación, protección de rutas y roles.

## Características del Backend
1. **Gestión de Usuarios**:
   - CRUD completo para Administradores y Técnicos.
   - Validación de datos para todos los campos del modelo de usuario.
2. **Gestión de Materiales**:
   - CRUD completo de materiales.
   - Relación entre materiales y el administrador que los creó.
3. **Gestión de Asignaciones**:
   - Asignación de materiales a técnicos con límites definidos.
   - Seguimiento del uso y devolución de materiales no utilizados al inventario.
4. **Reportes**:
   - Soporte para reportes diarios con detalles de uso de materiales y desempeño de técnicos.
5. **Autenticación y Roles**:
   - Rutas protegidas mediante JWT.
   - Roles definidos: Administrador y Técnico, con accesos diferenciados.

## Instalación
### Prerrequisitos
- Node.js v20.16.0
- MongoDB

### Pasos
1. Clona el repositorio:
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` con las siguientes variables:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/nombre_base_datos
   JWT_SECRET=tu_secreto_para_jwt
   ```
4. Inicia el servidor:
   ```bash
   npm start
   ```

## Endpoints Principales
### Usuarios
- `GET /api/users/all`: Obtener todos los usuarios activos (Solo Administradores).
- `POST /api/users/create`: Crear un nuevo usuario.
- `PUT /api/users/update/:id`: Actualizar un usuario existente.

### Materiales
- `POST /api/materials/create`: Crear un nuevo material.
- `GET /api/materials/all`: Listar todos los materiales.

### Asignaciones
- `POST /api/assignments/create`: Crear una asignación de materiales a un técnico.
- `GET /api/assignments/technician/today`: Obtener asignaciones del día actual para un técnico.

### Autenticación
- `POST /api/auth/login`: Iniciar sesión.
- `POST /api/auth/logout`: Cerrar sesión.

## Ejemplos de Solicitudes y Respuestas
### Crear Usuario
#### Solicitud:
```json
POST /api/users/create
Content-Type: application/json
{
  "name": "John Doe",
  "email": "johndoe@gmail.com",
  "password": "12345",
  "role": "Tecnico"
}
```
#### Respuesta:
```json
{
  "message": "Usuario creado correctamente",
  "user": {
    "id": "1a2b3c4d5e6f7g8h9i0j",
    "name": "John Doe",
    "email": "johndoe@gmail.com",
    "role": "Tecnico",
    "status": true
  }
}


