import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Base from './components/Base'; // Verifica la ruta y el nombre del componente
import NavBar from './components/NavBar'; // Verifica la ruta y el nombre del componente
import Footer from './components/Footer'; // Verifica la ruta y el nombre del componente
import AddQuote from './components/AddQuote'; // Verifica la ruta y el nombre del componente


const App = () => (
    <>
    <NavBar />
    <br></br>
    <Routes>
        <Route path="/" element={<Base />} />
        <Route path="/AddQuote" element={<AddQuote />} />
        <Route path="*" element={<p>There's nothing here: 404!</p>} />
    </Routes>
    <br></br>
    <Footer />
</>
);

export default App;

