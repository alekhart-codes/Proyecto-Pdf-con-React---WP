import React from 'react';
import App from './App';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed     var element = document.getElementById('wprk-admin-app');");

    var element = document.getElementById('wprk-admin-app');

    if (element) {
        const root = createRoot(element);
        root.render(
            <HashRouter>
                <React.StrictMode>
                    <App />
                </React.StrictMode>
            </HashRouter>
        );
        console.log("App rendered");
    } else {
        console.error('Element with ID "wprk-admin-app" not found');
        // Puedes también mostrar un mensaje de error en la interfaz de usuario si es necesario
        document.body.innerHTML = '<p>Error: Application container not found.</p>';

    }
});