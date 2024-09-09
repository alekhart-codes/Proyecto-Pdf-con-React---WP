import React from "react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <>
      <header className="header">
        <div className="logo">Cotizador PDF</div>
        <div className="search-bar">
          <input type="text" placeholder="Explorar cotizaciones..." />
        </div>
        <div className="user-settings">
          <span>Usuario</span>
          <span>Configuración</span>
        </div>
      </header>

      <nav className="nav">
        <NavLink 
          to="/" 
          className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}
        >
          Ver Cotizaciones
        </NavLink>
        <NavLink 
          to="/AddQuote" 
          className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}
        >
          Generar Cotización
        </NavLink>
      </nav>
    </>
  );
};

export default NavBar;
