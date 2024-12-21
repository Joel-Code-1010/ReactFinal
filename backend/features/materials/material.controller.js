const Material = require('./material.model');

// Crear un material
const createMaterial = async (req, res) => {
    const { name, quantity, description } = req.body; // Extraer los datos necesarios del cuerpo de la solicitud
    try {
        // Crear una nueva instancia del modelo Material con los datos proporcionados y el adminId desde req.user
        const newMaterial = new Material({ 
            name, 
            quantity, 
            description, 
            adminId: req.user.id // Asignar automáticamente el adminId del usuario autenticado
        });
        await newMaterial.save(); // Guardar el material en la base de datos
        res.status(201).json({ message: 'Material creado exitosamente', material: newMaterial });
    } catch (error) {
        // Manejar errores y responder con un mensaje adecuado
        res.status(500).json({ message: 'Error al crear el material', error });
    }
};

// Obtener todos los materiales
const getMaterials = async (req, res) => {
    try {
        const materials = await Material.find(); // Obtener todos los materiales de la base de datos
        res.status(200).json(materials); // Responder con los materiales encontrados
    } catch (error) {
        // Manejar errores y responder con un mensaje adecuado
        res.status(500).json({ message: 'Error al obtener los materiales', error });
    }
};

// Obtener un material por ID
const getMaterialById = async (req, res) => {
    const { id } = req.params; // Obtener el ID del material desde los parámetros de la solicitud
    try {
        const material = await Material.findById(id); // Buscar el material por su ID
        if (!material) {
            // Responder con un error si el material no existe
            return res.status(404).json({ message: 'Material no encontrado' });
        }
        res.status(200).json(material); // Responder con los datos del material encontrado
    } catch (error) {
        // Manejar errores y responder con un mensaje adecuado
        res.status(500).json({ message: 'Error al obtener el material', error });
    }
};

// Actualizar un material
const updateMaterial = async (req, res) => {
    const { id } = req.params; // Obtener el ID del material desde los parámetros de la solicitud
    const { name, quantity, description } = req.body; // Obtener los datos actualizados del cuerpo de la solicitud
    try {
        // Buscar y actualizar el material, retornando el documento actualizado
        const material = await Material.findByIdAndUpdate(
            id,
            { name, quantity, description }, // Campos a actualizar
            { new: true, runValidators: true } // Opciones: devolver el documento actualizado y validar los cambios
        );
        if (!material) {
            // Responder con un error si el material no existe
            return res.status(404).json({ message: 'Material no encontrado' });
        }
        res.status(200).json({ message: 'Material actualizado exitosamente', material }); // Responder con el material actualizado
    } catch (error) {
        // Manejar errores y responder con un mensaje adecuado
        res.status(500).json({ message: 'Error al actualizar el material', error });
    }
};

// Eliminar un material
const deleteMaterial = async (req, res) => {
    const { id } = req.params; // Obtener el ID del material desde los parámetros de la solicitud
    try {
        const material = await Material.findByIdAndDelete(id); // Eliminar el material por su ID
        if (!material) {
            // Responder con un error si el material no existe
            return res.status(404).json({ message: 'Material no encontrado' });
        }
        res.status(200).json({ message: 'Material eliminado exitosamente' }); // Confirmar la eliminación exitosa
    } catch (error) {
        // Manejar errores y responder con un mensaje adecuado
        res.status(500).json({ message: 'Error al eliminar el material', error });
    }
};

// Aumentar el stock de un material
const addMaterialStock = async (req, res) => {
    const { id } = req.params; // Obtener el ID del material desde los parámetros de la solicitud
    const { quantity } = req.body; // Obtener la cantidad a agregar desde el cuerpo de la solicitud
    try {
        // Validar que la cantidad sea positiva
        if (quantity <= 0) {
            return res.status(400).json({ message: 'La cantidad debe ser mayor a 0' });
        }

        // Buscar y actualizar el stock del material
        const material = await Material.findById(id);
        if (!material) {
            return res.status(404).json({ message: 'Material no encontrado' });
        }

        material.quantity += quantity; // Incrementar el stock
        await material.save(); // Guardar los cambios

        res.status(200).json({ message: 'Stock aumentado exitosamente', material });
    } catch (error) {
        res.status(500).json({ message: 'Error al aumentar el stock del material', error });
    }
};

module.exports = {
    createMaterial,
    getMaterials,
    getMaterialById,
    updateMaterial,
    deleteMaterial,
    addMaterialStock
};
