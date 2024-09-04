// src/components/QuoteTable.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuoteTable = () => {
    const [quotes, setQuotes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const fetchQuotes = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get(`/wp-json/wprk/v1/quotes?page=${page}`);
            setQuotes(response.data.quotes);
            setTotalPages(response.data.totalPages); // Suponiendo que la API devuelve totalPages
            setCurrentPage(page);
        } catch (error) {
            console.error('Error fetching quotes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuotes(currentPage);
    }, [currentPage]);

    const handlePageChange = (page) => {
        fetchQuotes(page);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Título</th>
                        <th>Nro. Cotización</th>
                        <th>Nro. Orden</th>
                        <th>Nro. Factura</th>
                        <th>Estado</th>
                        <th>Valor Total</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {quotes.map((quote) => (
                        <tr key={quote.id}>
                            <td>
                                <input type="checkbox" />
                            </td>
                            <td>
                                <strong>
                                    <a href={`/wp-admin/post.php?post=${quote.id}&action=edit`}>
                                        {quote.title}
                                    </a>
                                </strong>
                            </td>
                            <td>{quote.nro_de_cotizacion}</td>
                            <td>{quote.nro_orden}</td>
                            <td>{quote.nro_de_factura}</td>
                            <td>{quote.estado}</td>
                            <td>$ {quote.total}</td>
                            <td>
                                <a href={`/wp-admin/post.php?post=${quote.id}&action=edit`}>Editar</a> | 
                                <a href={`/wp-admin/post.php?post=${quote.id}&action=trash`} className="trash">Eliminar</a> |
                                <a href={`/cotizaciones/${quote.slug}`} target="_blank">Ver Cotización</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                {currentPage > 1 && <button onClick={() => handlePageChange(currentPage - 1)}>Anterior</button>}
                {currentPage < totalPages && <button onClick={() => handlePageChange(currentPage + 1)}>Siguiente</button>}
            </div>
        </div>
    );
};

export default QuoteTable;
