import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Base from './components/Base';
import NavBar from './components/NavBar';
import { Footer } from './components/Footer';
//import Home from './components/Home'; // Asegúrate de tener este componente si lo necesitas
//import About from './components/About'; // Asegúrate de tener este componente si lo necesitas

const App = () => (
    <>
        <NavBar /> {/* Asegúrate de tener este componente */}
        <nav>
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/about">About</NavLink>
        </nav>
        <Routes>
            <Route index element={<Base />} />
            <Route path="*" element={<p>There's nothing here: 404!</p>} />
        </Routes>
        <Footer /> {/* Asegúrate de tener este componente */}
    </>
);

export default App;
