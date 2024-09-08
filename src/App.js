// App.js
import React from 'react';  
import Base from './components/Base';
import NavBar from './components/NavBar';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Footer } from './components/Footer';
function App() {
    console.log("App is rendering");
    console.log(Base); // Esto debería mostrar la función del componente Base
    console.log(NavBar)
    return (
        <><br></br>
        <br></br>
         <NavBar></NavBar>
         <Routes>
            <Route path='/' element={<Base />}></Route>
            </Routes>
        <Footer></Footer>
        </>
            );
}

export default App;
