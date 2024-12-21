const Assignment = require('./assignment.model'); // Importar el modelo de asignaciones
const User = require('../users/user.model'); // Importar el modelo de usuarios
const Material = require('../materials/material.model'); // Importar el modelo de materiales

// Crear una nueva asignación
const createAssignment = async (req, res) => {
    const { name, technicianId, materials, dateAssigned } = req.body; // Agregar el campo dateAssigned opcional
    try {
        // Verificar que el usuario especificado es un técnico activo
        const technician = await User.findById(technicianId);
        if (!technician || !technician.status) {
            // Retornar un error si el técnico no está activo o no existe
            return res.status(400).json({ message: 'El técnico no está activo o no existe' });
        }
        if (technician.role !== 'Tecnico') {
            // Retornar un error si el usuario no tiene el rol de técnico
            return res.status(400).json({ message: 'No se pueden asignar materiales a usuarios que no sean técnicos' });
        }

        // Validar que las cantidades solicitadas no excedan el stock disponible
        for (const item of materials) {
            const material = await Material.findById(item.materialId);
            if (!material) {
                return res.status(400).json({ message: `El material con ID ${item.materialId} no existe` });
            }
            if (item.quantity > material.quantity) {
                return res.status(400).json({ 
                    message: `La cantidad asignada (${item.quantity}) excede el stock disponible (${material.quantity}) para el material ${material.name}`
                });
            }
        }

        // Crear una nueva asignación con el ID del administrador autenticado
        const newAssignment = new Assignment({ 
            name, 
            technicianId, 
            materials, 
            assignedBy: req.user.id, // Asignar automáticamente el ID del administrador autenticado
            dateAssigned: dateAssigned || new Date() // Usar la fecha proporcionada o la actual
        });
        await newAssignment.save(); // Guardar en la base de datos

        // Reducir el stock de los materiales asignados
        for (const item of materials) {
            const material = await Material.findById(item.materialId);
            material.quantity -= item.quantity;
            await material.save();
        }

        res.status(201).json({ message: 'Asignación creada exitosamente', assignment: newAssignment });
    } catch (error) {
        // Manejar errores del servidor
        res.status(500).json({ message: 'Error al crear la asignación', error });
    }
};

// Obtener todas las asignaciones (solo para administradores)
const getAllAssignments = async (req, res) => {
    try {
        // Buscar asignaciones únicamente de técnicos activos
        const assignments = await Assignment.find()
            .populate({
                path: 'technicianId',
                match: { status: true, role: 'Tecnico' } // Filtrar por técnicos activos
            })
            .populate('materials.materialId'); // Incluir detalles de los materiales

        // Filtrar las asignaciones donde technicianId no sea nulo (técnicos activos)
        const filteredAssignments = assignments.filter(assignment => assignment.technicianId !== null);

        res.status(200).json(filteredAssignments); // Retornar las asignaciones filtradas
    } catch (error) {
        // Manejar errores del servidor
        res.status(500).json({ message: 'Error al obtener las asignaciones', error });
    }
};

// Obtener las asignaciones del día actual para un técnico
const getTodayAssignmentsByTechnician = async (req, res) => {
    try {
        const technicianId = req.user.id; // ID del técnico autenticado
        const today = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD

        // Buscar asignaciones creadas el día actual y vinculadas al técnico autenticado
        const assignments = await Assignment.find({
            technicianId,
            dateAssigned: { $gte: new Date(today) }
        }).populate('materials.materialId');

        res.status(200).json(assignments); // Retornar las asignaciones encontradas
    } catch (error) {
        // Manejar errores del servidor
        res.status(500).json({ message: 'Error al obtener las asignaciones del día', error });
    }
};

// Obtener el historial de asignaciones para un técnico
const getHistoryAssignmentsByTechnician = async (req, res) => {
    try {
        const technicianId = req.user.id; // ID del técnico autenticado
        const today = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD

        // Buscar asignaciones creadas antes del día actual y vinculadas al técnico autenticado
        const assignments = await Assignment.find({
            technicianId,
            dateAssigned: { $lt: new Date(today) }
        }).populate('materials.materialId');

        res.status(200).json(assignments); // Retornar las asignaciones encontradas
    } catch (error) {
        // Manejar errores del servidor
        res.status(500).json({ message: 'Error al obtener el historial de asignaciones', error });
    }
};

// Actualizar la cantidad utilizada por el técnico
const updateUsedQuantity = async (req, res) => {
    const { assignmentId, materialId } = req.params; // Obtener los IDs de la asignación y material
    const { usedQuantity } = req.body; // Cantidad utilizada proporcionada por el técnico

    try {
        // Buscar la asignación especificada
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            // Retornar un error si la asignación no existe
            return res.status(404).json({ message: 'Asignación no encontrada' });
        }

        // Verificar que la asignación pertenece al día actual
        const today = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD
        const assignmentDate = new Date(assignment.dateAssigned).toISOString().split('T')[0];
        if (assignmentDate !== today) {
            return res.status(400).json({ message: 'Solo se pueden actualizar asignaciones del día actual' });
        }

        // Verificar que la asignación está en estado Pendiente
        const status = await assignment.status;
        if (status !== 'Pendiente') {
            return res.status(400).json({ message: 'Solo se pueden actualizar asignaciones en estado Pendiente' });
        }

        // Verificar que el técnico asignado está activo y tiene el rol correcto
        const technician = await User.findById(assignment.technicianId);
        if (!technician || !technician.status || technician.role !== 'Tecnico') {
            // Retornar un error si el técnico no está activo o no tiene el rol correcto
            return res.status(400).json({ message: 'El técnico no está activo, no existe o no tiene el rol correcto' });
        }

        // Buscar el material dentro de la asignación
        const material = assignment.materials.find(mat => mat.materialId.toString() === materialId);
        if (!material) {
            // Retornar un error si el material no se encuentra en la asignación
            return res.status(404).json({ message: 'Material no encontrado en la asignación' });
        }

        if (usedQuantity > material.quantity) {
            // Validar que la cantidad utilizada no supere la cantidad asignada
            return res.status(400).json({ message: 'La cantidad utilizada no puede superar la cantidad asignada' });
        }

        // Actualizar el stock del material en caso de que no se utilice todo
        const materialModel = await Material.findById(material.materialId);
        const unusedQuantity = material.quantity - usedQuantity; // Cantidad no utilizada
        materialModel.quantity += unusedQuantity; // Devolver la cantidad no utilizada al stock
        await materialModel.save();

        material.usedQuantity = usedQuantity; // Actualizar la cantidad utilizada
        // material.quantity = usedQuantity; // Ajustar la cantidad asignada al utilizado
        await assignment.save(); // Guardar los cambios en la base de datos

        res.status(200).json({ message: 'Cantidad utilizada actualizada exitosamente', assignment });
    } catch (error) {
        // Manejar errores del servidor
        res.status(500).json({ message: 'Error al actualizar la cantidad utilizada', error });
    }
};

// Confirmar que una asignación está completa
const completeAssignment = async (req, res) => {
    const { assignmentId } = req.params; // Obtener el ID de la asignación

    try {
        // Buscar la asignación especificada
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: 'Asignación no encontrada' });
        }

        // Verificar que la asignación pertenece al técnico autenticado
        if (assignment.technicianId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'No tienes permiso para completar esta asignación' });
        }

        // Cambiar el estado de la asignación a completada
        assignment.status = 'Completada';
        await assignment.save();

        res.status(200).json({ message: 'Asignación completada exitosamente', assignment });
    } catch (error) {
        res.status(500).json({ message: 'Error al completar la asignación', error });
    }
};

// Exportar los controladores
module.exports = {
    createAssignment,
    getAllAssignments,
    getTodayAssignmentsByTechnician,
    getHistoryAssignmentsByTechnician,
    updateUsedQuantity,
    completeAssignment
};
