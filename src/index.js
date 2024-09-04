import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createRoot } from 'react-dom/client';

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");
    var element = document.getElementById('wprk-admin-app');
    if (typeof element !== 'undefined' && element !== null) {
        const root = createRoot(element);
        root.render(<App />);
    }
});
