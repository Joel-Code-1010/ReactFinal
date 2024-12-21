const User = require('./user.model');
const bcrypt = require('bcrypt');

// ID de la cuenta padre que no puede ser actualizada ni eliminada
const MASTER_ADMIN_ID = '67647e2fff69b2242efd205a';

// Obtener todos los usuarios activos (status: true)
const getUsers = async (req, res) => {
    try {
        // Buscar todos los usuarios cuyo estado sea activo
        // Excluir el campo de contraseña para proteger la información sensible
        const users = await User.find({ status: true }).select('-password');
        res.status(200).json(users);
    } catch (error) {
        // En caso de error, responder con un mensaje y el detalle del error
        res.status(500).json({ message: 'Error al obtener los usuarios', error });
    }
};

// Obtener un usuario por su ID si está activo
const getUserById = async (req, res) => {
    const { id } = req.params;
    try {

        if(req.user.id !== id){
            return res.status(403).json({message:"No puedes ver información de otro usuario"})
        }

        // Buscar el usuario por ID y verificar que esté activo
        const user = await User.findOne({ _id: id, status: true }).select('-password');
        if (!user) {
            // Responder con un error 404 si no se encuentra el usuario activo
            return res.status(404).json({ message: 'Usuario no encontrado o no activo' });
        }
        res.status(200).json(user);
    } catch (error) {
        // En caso de error, responder con un mensaje y el detalle del error
        res.status(500).json({ message: 'Error al obtener el usuario', error });
    }
};

// Buscar usuarios por nombre (solo para administradores)
const searchUserByName = async (req, res) => {
    const { name } = req.query;
    try {
        // Utilizar una expresión regular para buscar coincidencias parciales en el nombre
        // Solo se devuelven usuarios cuyo estado sea activo
        const users = await User.find({ name: { $regex: name, $options: 'i' }, status: true }).select('-password');
        if (!users.length) {
            // Responder con un error 404 si no se encuentran coincidencias
            return res.status(404).json({ message: 'No se encontraron usuarios con ese nombre' });
        }
        res.status(200).json(users);
    } catch (error) {
        // En caso de error, responder con un mensaje y el detalle del error
        res.status(500).json({ message: 'Error al buscar usuarios', error });
    }
};

// Crear un nuevo usuario
const createUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        // Verificar si ya existe un usuario con el mismo email
        const userExists = await User.findOne({ email });
        if (userExists) {
            // Responder con un error 400 si el email ya está en uso
            return res.status(400).json({ message: 'El email ya está en uso' });
        }

        // Crear el nuevo usuario con los datos proporcionados
        const user = new User({ name, email, password, role });
        await user.save();

        // Responder con un mensaje de éxito y los datos del usuario creado
        res.status(201).json({ message: 'Usuario creado correctamente', user });
    } catch (error) {
        // En caso de error, responder con un mensaje y el detalle del error
        res.status(500).json({ message: 'Error al crear el usuario', error });
    }
};

// Actualizar un usuario (sin permitir cambios en el estado ni mostrar contraseñas)
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body; // Filtrar solo campos permitidos

    try {
        // Evitar que la cuenta padre sea actualizada
        if (id === MASTER_ADMIN_ID) {
            return res.status(403).json({ message: 'No se permite actualizar los datos de la cuenta principal' });
        }

        // Buscar el usuario por ID y verificar que esté activo
        const user = await User.findOne({ _id: id, status: true });
        if (!user) {
            // Responder con un error 404 si el usuario no existe o no está activo
            return res.status(404).json({ message: 'Usuario no encontrado o no activo' });
        }

        // Actualizar solo los campos permitidos
        user.name = name || user.name;
        user.email = email || user.email;

        // Guardar los cambios en la base de datos
        await user.save();

        // Responder con un mensaje de éxito y los datos del usuario actualizado
        res.status(200).json({ message: 'Usuario actualizado correctamente', user });
    } catch (error) {
        // En caso de error, responder con un mensaje y el detalle del error
        res.status(500).json({ message: 'Error al actualizar el usuario', error });
    }
};

// Cambiar la contraseña de un usuario
const changePassword = async (req, res) => {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    try {
        // Verificar que el usuario que hace la solicitud es el dueño de la cuenta
        if (req.user.id !== id) {
            return res.status(403).json({ message: 'No puedes cambiar la contraseña de otra cuenta' });
        }

        // Buscar el usuario por ID
        const user = await User.findOne({ _id: id, status: true });
        if (!user) {
            // Responder con un error 404 si el usuario no existe o no está activo
            return res.status(404).json({ message: 'Usuario no encontrado o no activo' });
        }

        // Verificar que la contraseña antigua sea correcta
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'La contraseña actual es incorrecta' });
        }

        // Actualizar la nueva contraseña (el middleware del modelo manejará el hasheo)
        user.password = newPassword;

        // Guardar los cambios en la base de datos
        await user.save();

        // Responder con un mensaje de éxito
        res.status(200).json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        // En caso de error, responder con un mensaje y el detalle del error
        res.status(500).json({ message: 'Error al cambiar la contraseña', error });
    }
};

// Eliminar un usuario lógicamente (cambiar su estado a false)
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        // Evitar que la cuenta padre sea eliminada
        if (id === MASTER_ADMIN_ID) {
            return res.status(403).json({ message: 'No se permite eliminar la cuenta principal' });
        }

        // Buscar el usuario por ID y verificar que esté activo
        const user = await User.findOne({ _id: id, status: true });
        if (!user) {
            // Responder con un error 404 si el usuario no existe o no está activo
            return res.status(404).json({ message: 'Usuario no encontrado o no activo' });
        }

        // Cambiar el estado del usuario a inactivo
        user.status = false;
        await user.save();

        // Responder con un mensaje de éxito y los datos del usuario eliminado
        res.status(200).json({ message: 'Usuario eliminado correctamente', user });
    } catch (error) {
        // En caso de error, responder con un mensaje y el detalle del error
        res.status(500).json({ message: 'Error al eliminar el usuario', error });
    }
};

module.exports = {
    getUsers,
    getUserById,
    searchUserByName,
    createUser,
    updateUser,
    changePassword,
    deleteUser,
};
