import React from 'react';
import App from './App';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed"); // Mensaje para verificar que el DOM se ha cargado

    // Selecciona el elemento con el ID 'wprk-admin-app'
    var element = document.getElementById('wprk-admin-app');

    if (element) { // Verifica que el elemento existe
        const root = createRoot(element);
        root.render(
            <BrowserRouter basename="/wp-admin/admin.php?page=wprk-settings">
                <React.StrictMode>
                    <App />
                </React.StrictMode>
            </BrowserRouter>
        );
        console.log("App rendered"); // Mensaje para verificar que la aplicación se está renderizando
    } else {
        console.error('Element with ID "wprk-admin-app" not found'); // Mensaje de error si el elemento no se encuentra
    }
});
