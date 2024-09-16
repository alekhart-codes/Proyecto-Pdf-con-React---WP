import React from 'react';
import axios from 'axios';

export const DropQuote = ({ id, onDelete }) => {
    const handleDelete = async () => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta cotización?')) {
            return;
        }
        console.log('Nonce:', appLocalizer.nonce);

        console.log('Nonce:', appLocalizer.apiUrl);

        try {
            await axios.delete(`${appLocalizer.apiUrl}/drop-quote/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-NONCE': appLocalizer.nonce  // Verifica que appLocalizer.nonce sea correcto
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
            e.preventDefault(); // Evita el comportamiento predeterminado del enlace
            handleDelete(); // Llama a la función de eliminación
        }} className="trash">Eliminar</a>
    );
};
