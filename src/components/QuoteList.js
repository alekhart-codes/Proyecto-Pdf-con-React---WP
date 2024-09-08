import React, { useState, useEffect } from 'react';
import axios from 'axios';
import generatePdf from './generatePdf'; // Asegúrate de importar la función correctamente
import PDFPreview from './PDFPreview'; // Asegúrate de tener este componente creado

const QuoteList = () => {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [displayedQuotes, setDisplayedQuotes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [visibleCount, setVisibleCount] = useState(10);
    const [showPreview, setShowPreview] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');
    const url = `${appLocalizer.apiUrl}/wprk/v1/get-quotes`;
    
    // Manejar clic para vista previa
    const handlePreviewClick = async () => {
        try {
            const url = await generatePdf();
            setPdfUrl(url);
            setShowPreview(true);
        } catch (error) {
            console.error('Error al generar el PDF para la vista previa:', error);
        }
    };

    // Manejar el cierre de la vista previa
    const handleClosePreview = () => {
        setShowPreview(false);
        setPdfUrl('');
    };

    useEffect(() => {
        axios.get(url, {
            headers: {
                'content-type': 'application/json',
                'X-WP-NONCE': appLocalizer.nonce
            }
        })
        .then(response => {
            console.log('Respuesta de la API:', response.data);

            if (response.data && Array.isArray(response.data)) {
                setQuotes(response.data);
                setDisplayedQuotes(response.data.slice(0, visibleCount));
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
    }, [visibleCount]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                setVisibleCount(prevCount => prevCount + 2);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        const filteredQuotes = quotes.filter(quote => 
            quote.title.toLowerCase().includes(e.target.value.toLowerCase()) || 
            quote.nro_de_cotizacion.toString().includes(e.target.value) ||
            quote.nro_orden.toString().includes(e.target.value) ||
            quote.nro_de_factura.toString().includes(e.target.value)
        );
        setDisplayedQuotes(filteredQuotes.slice(0, visibleCount));
    };

    if (loading) return <p>Cargando cotizaciones...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="quote-list-section">
            <h2>Cotizaciones</h2>
            <div className="search-bar">
                <input 
                    type="text" 
                    placeholder="Buscar cotizaciones..." 
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            <div className="quote-list">
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
                        {displayedQuotes.map((quote) => (
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
                                    <a href="#" onClick={handlePreviewClick}>Ver Cotización</a>
                                </td>
                            </tr>
                        ))}
                                    {showPreview && (
                <PDFPreview pdfUrl={pdfUrl} onClose={handleClosePreview} />
            )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default QuoteList;
