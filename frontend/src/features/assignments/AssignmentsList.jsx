import React, { useState, useEffect } from 'react';
import assignmentService from './assignmentService';
import AssignmentForm from './AssignmentForm';

const AssignmentsList = () => {
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await assignmentService.getAllAssignments();
        setAssignments(response);
      } catch (err) {
        setError('Error al cargar las asignaciones');
      }
    };

    fetchAssignments();
  }, []);

  const handleSaveNewAssignment = async (newAssignment) => {
    try {
      const createdAssignment = await assignmentService.createAssignment(newAssignment);
      setAssignments((prev) => [...prev, createdAssignment]);
      setIsAdding(false);
    } catch (err) {
      setError('Error al crear la asignación');
    }
  };

  return (
    <div>
      <h1>Lista de Asignaciones</h1>
      <button onClick={() => setIsAdding(true)}>Crear Nueva Asignación</button>
      {error && <p className="error-message">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Técnico</th>
            <th>Fecha</th>
            <th>Materiales</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => (
            <tr key={assignment._id}>
              <td>{assignment.name}</td>
              <td>
                {typeof assignment.technicianId === 'object'
                  ? assignment.technicianId.name || 'Técnico desconocido'
                  : assignment.technicianId}
              </td>
              <td>
                {assignment.dateAssigned
                  ? new Date(assignment.dateAssigned).toLocaleDateString()
                  : 'Sin fecha'}
              </td>
              <td>
                {assignment.materials && Array.isArray(assignment.materials)
                  ? assignment.materials
                      .map((material) => {
                        const materialName =
                          material.materialId?.name || 'Material desconocido';
                        const quantity = material.quantity || 0;
                        return `${materialName} (${quantity})`;
                      })
                      .join(', ')
                  : 'Sin materiales'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isAdding && (
        <AssignmentForm
          onSave={handleSaveNewAssignment}
          onCancel={() => setIsAdding(false)}
        />
      )}
    </div>
  );
};

export default AssignmentsList;
