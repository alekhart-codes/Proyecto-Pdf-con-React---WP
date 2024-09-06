import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuoteList = () => {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const url = `${appLocalizer.apiUrl}/wprk/v1/get-quotes`;

    const fetchQuotes = (page) => {
        setLoading(true);
        axios.get(url, {
            headers: {
                'content-type': 'application/json',
                'X-WP-NONCE': appLocalizer.nonce
            },
            params: {
                page,
            }
        })
        .then(response => {
            if (response.data && Array.isArray(response.data)) {
                setQuotes(prevQuotes => [...prevQuotes, ...response.data]);
                setHasMore(response.data.length > 0);
            } else {
                setHasMore(false);
            }
            setLoading(false);
        })
        .catch(error => {
            console.error('Error al recuperar las cotizaciones:', error);
            setError('Error al recuperar las cotizaciones');
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchQuotes(page);
    }, [page]);

    const handleScroll = (e) => {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) return;
        setPage(prevPage => prevPage + 1);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading]);

    if (error) return <p>{error}</p>;

    return (
        <div className="quote-list">
            <h2>Cotizaciones</h2>
            <table>
                <thead>
                    <tr>
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
            {loading && <p>Cargando más cotizaciones...</p>}
            {!hasMore && !loading && <p>No hay más cotizaciones para mostrar.</p>}
        </div>
    );
};

export default QuoteList;
