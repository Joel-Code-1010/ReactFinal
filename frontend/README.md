# README.md

## Descripción General del Sistema
El sistema es una aplicación web desarrollada para gestionar materiales y reportes en un entorno técnico. Este proyecto facilita la colaboración entre técnicos y administradores, mejorando la eficiencia operativa mediante funcionalidades claras y bien definidas para cada rol.

### Funcionalidades del Frontend
El frontend de esta aplicación está desarrollado en React y sigue una estructura modular basada en características. Sus principales funcionalidades incluyen:

#### Autenticación y Manejo de Sesiones
- **Inicio de Sesión:** Permite a los usuarios autenticarse utilizando sus credenciales.
- **Estado de Sesión:** Gestiona la validez de la sesión utilizando cookies seguras para verificar y mantener la autenticación de los usuarios.
- **Cierre de Sesión:** Proporciona un mecanismo para que los usuarios finalicen sus sesiones de forma segura.

#### Gestión de Usuarios (Administrador)
- CRUD completo para usuarios:
  - Crear nuevos usuarios (técnicos o administradores).
  - Editar datos existentes de usuarios.
  - Eliminar usuarios de forma lógica.
  - Cambiar contraseñas.

#### Gestión de Materiales (Administrador)
- CRUD completo para materiales:
  - Crear, editar y eliminar materiales.
  - Aumentar el stock de materiales disponibles.

#### Asignación de Materiales (Administrador)
- Crear listas de materiales para asignar a técnicos, definiendo límites por material.
- Visualizar todas las asignaciones existentes y sus estados.

#### Reportes
- **Reporte General (Administrador):**
  - Incluye estadísticas de uso del sistema, como el total de usuarios activos, asignaciones completadas y consumo de materiales.
- **Reporte de Desempeño Técnico (Administrador):**
  - Muestra estadísticas detalladas por técnico, identificando al técnico más productivo y al mayor consumidor de materiales.

#### Funciones del Técnico
- **Visualización de Asignaciones:**
  - Consultar las asignaciones del día y el historial de asignaciones previas.
- **Uso de Materiales:**
  - Actualizar las cantidades de materiales utilizados en una asignación.
- **Completar Asignaciones:**
  - Cambiar el estado de una asignación a completada al finalizar el trabajo.

### Tecnologías Utilizadas
- **Frontend:** React, React Router DOM.
- **Estado y Autenticación:** useState, useEffect, y cookies gestionadas con js-cookie.
- **Estilo:** CSS modularizado en componentes.

### Estructura del Frontend
La estructura del proyecto está organizada de la siguiente forma:

```
frontend/
  ├── public/
  ├── src/
      ├── api/
      │   └── api.js
      ├── assets/
      ├── context/
      │   └── AuthContext.js
      ├── features/
      │   ├── assignments/
      │   │   ├── AssignmentForm.jsx
      │   │   ├── assignmentService.js
      │   │   └── AssignmentsList.jsx
      │   ├── auth/
      │   │   ├── authService.js
      │   │   └── Login.jsx
      │   ├── materials/
      │   │   ├── MaterialForm.jsx
      │   │   ├── MaterialList.jsx
      │   │   └── materialService.js
      │   ├── reports/
      │   │   ├── reportService.js
      │   │   └── ReportsList.jsx
      │   └── users/
      │       ├── UserForm.jsx
      │       ├── userService.js
      │       └── UsersList.jsx
      ├── hooks/
      │   └── useAuth.js
      ├── pages/
      │   ├── dashboardAdmin.jsx
      │   └── dashboardTecnico.jsx
      ├── routes/
      │   └── appRoutes.jsx
      ├── App.css
      ├── App.jsx
      ├── index.css
      ├── main.jsx
  ├── .gitignore
  ├── eslint.config.js
  ├── index.html
  ├── package-lock.json
  ├── package.json
  ├── README.md
  └── vite.config.js
```

### Instrucciones para Ejecutar el Proyecto
1. Clonar el repositorio.
2. Instalar las dependencias ejecutando `npm install` en la raíz del proyecto.
3. Configurar el archivo `.env` con las variables necesarias.
4. Ejecutar el proyecto con `npm run dev`.
5. Acceder a la aplicación en el navegador en la dirección [http://localhost:5173](http://localhost:5173).

### Ejemplo de Consumo de API
**Ejemplo de creación de usuario:**
```javascript
axios.post('/api/users/create', {
  name: 'Juan Perez',
  email: 'juan.perez@gmail.com',
  password: 'securepassword',
  role: 'Tecnico'
}, {
  headers: { Authorization: `Bearer ${token}` }
})
.then(response => console.log(response.data))
.catch(error => console.error(error.response.data));
```

**Ejemplo de respuesta:**
```json
{
  "message": "Usuario creado correctamente",
  "user": {
    "id": "12345",
    "name": "Juan Perez",
    "email": "juan.perez@gmail.com",
    "role": "Tecnico",
    "status": true
  }
}
```

