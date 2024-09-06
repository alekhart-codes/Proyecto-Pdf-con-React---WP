import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuoteList = () => {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const url = `${appLocalizer.apiUrl}/wprk/v1/get-quotes`;

    useEffect(() => {
        axios.get(url, {
            headers: {
                'content-type': 'application/json',
                'X-WP-NONCE': appLocalizer.nonce
            }
        })
        .then(response => {
            console.log('Respuesta de la API:', response.data); // Verifica la estructura

            if (response.data && Array.isArray(response.data)) {
                setQuotes(response.data);
            } else {
                console.error('Respuesta de la API no contiene cotizaciones válidas:', response.data);
                setError('Error al leer las cotizaciones');
            }
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
            <table>
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Nro. de Orden</th>
                        <th>Nro. de Cotización</th>
                        <th>Nro. de Factura</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Nota</th>
                        <th>Items</th>
                    </tr>
                </thead>
                <tbody>
                    {quotes.map(quote => (
                        <tr key={quote.id}>
                            <td>{quote.title}</td>
                            <td>{quote.nro_orden}</td>
                            <td>{quote.nro_de_cotizacion}</td>
                            <td>{quote.nro_de_factura}</td>
                            <td>{quote.fecha}</td>
                            <td>{quote.estado}</td>
                            <td>{quote.nota}</td>
                            <td>
                                <ul>
                                    {Array.isArray(quote.items) && quote.items.length > 0 ? (
                                        quote.items.map((item, index) => (
                                            <li key={index}>
                                                <p><strong>Producto:</strong> {item.producto}</p>
                                                <p><strong>Cantidad:</strong> {item.cantidad}</p>
                                                <p><strong>Precio Unitario:</strong> {item.precio_unitario}</p>
                                                <p><strong>Precio:</strong> {item.precio}</p>
                                            </li>
                                        ))
                                    ) : (
                                        <p>No hay items disponibles.</p>
                                    )}
                                </ul>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default QuoteList;

