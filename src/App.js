import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Base from './components/Base'; // Verifica la ruta y el nombre del componente
import NavBar from './components/NavBar'; // Verifica la ruta y el nombre del componente
import Footer from './components/Footer'; // Verifica la ruta y el nombre del componente
import AddQuote from './components/AddQuote'; // Verifica la ruta y el nombre del componente


const App = () => (
    <>
    <NavBar />
    <Routes>
        <Route path="/" element={<Base />} />
        <Route path="/AddQuote" element={<AddQuote />} />
        <Route path="*" element={<p>There's nothing here: 404!</p>} />
    </Routes>
    <Footer />
</>
);

export default App;

