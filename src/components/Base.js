import React, { useState } from 'react';
import './Base.css'; // Importa el archivo de estilos
import QuoteList from './QuoteList';
//import AddQuote from './components/AddQuote';

const Base = () => {

    return (
        <div>
                <QuoteList></QuoteList>
        </div>
    );
}

export default Base;
