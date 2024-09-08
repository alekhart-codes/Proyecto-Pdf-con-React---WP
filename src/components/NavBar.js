import React from 'react'
import { NavLink } from 'react-router-dom'

export const NavBar = () => {
  return (<>
    <header className="header">
    <div className="logo">Cotizador PDF</div>
    <div className="search-bar">
        <input type="text" placeholder="Buscar cotizaciones..." />
    </div>
    <div className="user-settings">
        <span>Usuario</span>
        <span>Configuración</span>
    </div>
</header>
    <nav className="nav">
    <a href="#"><NavLink to='/'>Cotizaciones</NavLink></a>
</nav></>
  )
}
export default NavBar;