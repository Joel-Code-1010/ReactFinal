# Sistema de Gestión de Materiales y Reportes para Técnicos

## Descripción
Este proyecto es una aplicación web que permite la gestión de usuarios, materiales y reportes técnicos en una organización. El sistema está diseñado para optimizar la colaboración entre administradores y técnicos, ofreciendo funcionalidades como asignación de materiales y generación de reportes diarios.

## Tecnologías Utilizadas
- **Backend**: Node.js, Express.js
- **Base de Datos**: MongoDB
- **Autenticación**: JSON Web Tokens (JWT) y Cookies
- **Frontend**: React.js

## Instalación y Ejecución
### Prerrequisitos
- Node.js v20.16.0 o superior
- MongoDB Atlas o una instancia local de MongoDB

### Pasos
1. Clona el repositorio:
   ```bash
   git clone <https://github.com/Joel-Code-1010/ReactFinal>
   cd <NOMBRE_DEL_PROYECTO>
   ```

2. Configura las variables de entorno en un archivo `.env`:
   ```env
   MONGO_URI=mongodb://localhost:27017/BdFinalJoel
   PORT=5100
   JWT_SECRET=10102002
   ```

3. Instala las dependencias:
   ```bash
   npm install
   ```

4. Inicia el servidor:
   ```bash
   node server.js
   ```

5. El servidor estará funcionando en: `http://localhost:5100`

## Pruebas de API
Las siguientes son solicitudes de ejemplo para probar las rutas principales de la API utilizando Postman o cualquier herramienta similar.

Descomenta esa ruta que esta en user.routes.js es solo para que cree un user admin 
Ruta momentanea solo para crear un user adminstrador
router.post('/create', createUser);

### Autenticación
#### Iniciar sesión
**URL**: `POST /api/auth/login`

**Cuerpo**:
```json
{
  "email": "admin@gmail.com",
  "password": "admin123"
}
```

**Respuesta**:
```json
{
  "message": "Inicio de sesión exitoso",
  "token": "<JWT_TOKEN>"
}
```

### Usuarios
#### Crear usuario
**URL**: `POST /api/users/create`

**Cuerpo**:
```json
{
  "name": "Juan Pérez",
  "email": "juan.perez@gmail.com",
  "password": "securepassword",
  "role": "Tecnico"
}
```

**Respuesta**:
```json
{
  "message": "Usuario creado correctamente",
  "user": {
    "id": "<ID_DEL_USUARIO>",
    "name": "Juan Pérez",
    "email": "juan.perez@gmail.com",
    "role": "Tecnico"
  }
}
```

### Materiales
#### Crear material
**URL**: `POST /api/materials/create`

**Cuerpo**:
```json
{
  "name": "Cable UTP",
  "quantity": 100,
  "description": "Cable de red categoría 6."
}
```

**Respuesta**:
```json
{
  "message": "Material creado exitosamente",
  "material": {
    "id": "<ID_DEL_MATERIAL>",
    "name": "Cable UTP",
    "quantity": 100,
    "description": "Cable de red categoría 6."
  }
}
```

### Asignaciones
#### Crear asignación
**URL**: `POST /api/assignments/create`

**Cuerpo**:
```json
{
  "name": "Instalación Red",
  "technicianId": "<ID_TECNICO>",
  "materials": [
    {
      "materialId": "<ID_MATERIAL>",
      "quantity": 10
    }
  ]
}
```

**Respuesta**:
```json
{
  "message": "Asignación creada exitosamente",
  "assignment": {
    "id": "<ID_ASIGNACION>",
    "name": "Instalación Red",
    "status": "Pendiente"
  }
}
```
```




