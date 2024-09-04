import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddQuote.css';

const QuoteList = () => {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('/wp-json/wprk/v1/get-quotes')
            .then(response => {
                setQuotes(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al recuperar las cotizaciones:', error);
                setError('Error al recuperar las cotizaciones');
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Cargando cotizaciones...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="quote-list">
            <h2>Cotizaciones</h2>
            <ul>
                {quotes.map(quote => (
                    <li key={quote.id}>
                        <h3>{quote.title}</h3>
                        <p><strong>Nro. de Orden:</strong> {quote.nro_orden}</p>
                        <p><strong>Nro. de Cotización:</strong> {quote.nro_de_cotizacion}</p>
                        <p><strong>Nro. de Factura:</strong> {quote.nro_de_factura}</p>
                        <p><strong>Fecha:</strong> {quote.fecha}</p>
                        <p><strong>Estado:</strong> {quote.estado}</p>
                        <p><strong>Nota:</strong> {quote.nota}</p>
                        <h4>Items:</h4>
                        <ul>
                            {quote.items.map((item, index) => (
                                <li key={index}>
                                    <p><strong>Producto:</strong> {item.producto}</p>
                                    <p><strong>Cantidad:</strong> {item.cantidad}</p>
                                    <p><strong>Precio Unitario:</strong> {item.precio_unitario}</p>
                                    <p><strong>Precio:</strong> {item.precio}</p>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default QuoteList;
