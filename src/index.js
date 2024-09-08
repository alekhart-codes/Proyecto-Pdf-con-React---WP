import React from 'react';
import App from './App';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");
    var element = document.getElementById('wprk-admin-app');
    if (typeof element !== 'undefined' && element !== null) {
        const root = createRoot(element);
        root.render(
            <BrowserRouter>
                <React.StrictMode>
                    <App />
                </React.StrictMode>
            </BrowserRouter>
    );
        console.log("App in");
    }
});
