import React from 'react';
import axios from 'axios';

export const DropQuote = ({ id, onDelete }) => {
    const handleDelete = async () => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta cotización?')) {
            return;
        }

        try {
            await axios.delete(`${appLocalizer.apiUrl}/wprk/v1/drop-quote/${id}`, {
                headers:
                {
                    'Content-Type': 'application/json',
                    'X-WP-NONCE': appLocalizer.nonce  // Incluye el nonce para la autenticación
                }
            });
            onDelete(id); // Llama a la función pasada para actualizar la lista de cotizaciones
            alert('Cotización eliminada con éxito');
        } catch (error) {
            console.error('Error al eliminar la cotización:', error);
            alert('No se pudo eliminar la cotización');
        }
    };

    return (
        <a href="#" onClick={(e) => { 
            e.preventDefault(); 
            handleDelete(); 
        }} className="trash">Eliminar</a>
    );
};

