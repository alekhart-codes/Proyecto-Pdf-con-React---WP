import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditQuote from './EditQuote'; // Asegúrate de que la ruta sea correcta
import generatePdf from './generatePdf';
import PDFPreview from './PDFPreview'; // Asegúrate de que la ruta sea correcta
import './QuoteList.css'; // Asegúrate de que la ruta sea correcta

const QuoteList = () => {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [displayedQuotes, setDisplayedQuotes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [visibleCount, setVisibleCount] = useState(10);
    const [showPreview, setShowPreview] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');
    const [updatedState, setUpdatedState] = useState({});
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const url = `${appLocalizer.apiUrl}/get-quotes`;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedQuoteId, setSelectedQuoteId] = useState(null);

    const openModal = (quoteId) => {
        setSelectedQuoteId(quoteId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedQuoteId(null);
        setIsModalOpen(false);
    };

    const handlePreviewClick = async (quote) => {
        try {
            const url = await generatePdf(quote);
            setPdfUrl(url);
            setShowPreview(true);
        } catch (error) {
            console.error('Error al generar el PDF para la vista previa:', error);
        }
    };

    const handleClosePreview = () => {
        setShowPreview(false);
        setPdfUrl('');
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        const filteredQuotes = quotes.filter(quote => {
            const matchesTerm = 
                quote.title.toLowerCase().includes(e.target.value.toLowerCase()) || 
                quote.nro_de_cotizacion.toString().includes(e.target.value) ||
                quote.nro_orden.toString().includes(e.target.value) ||
                quote.nro_de_factura.toString().includes(e.target.value);

            const quoteDate = new Date(quote.fecha);
            const matchesDate = (!startDate || quoteDate >= new Date(startDate)) &&
                                (!endDate || quoteDate <= new Date(endDate));

            return matchesTerm && matchesDate;
        });
        setDisplayedQuotes(filteredQuotes.slice(0, visibleCount));
    };

    const handleStateChange = (id, newState) => {
        setUpdatedState(prevState => ({
            ...prevState,
            [id]: newState
        }));
    
        axios.post(`${appLocalizer.apiUrl}/update-quote-state`, {
            id,
            estado: newState
        }, {
            headers: {
                'content-type': 'application/json',
                'X-WP-NONCE': appLocalizer.nonce
            }
        })
        .then(response => {
            console.log('Estado actualizado:', response.data);
        })
        .catch(error => {
            console.error('Error al actualizar el estado:', error);
        });
    };

    useEffect(() => {
        axios.get(url, {
            headers: {
                'content-type': 'application/json',
                'X-WP-NONCE': appLocalizer.nonce
            }
        })
        .then(response => {
            if (response.data && Array.isArray(response.data)) {
                setQuotes(response.data);
                setDisplayedQuotes(response.data.slice(0, visibleCount));
            } else {
                setError('Error al leer las cotizaciones');
            }
            setLoading(false);
        })
        .catch(error => {
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


    if (loading) return <p>Cargando cotizaciones...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="quote-list-section">
            
            <div className="search-bar" autoFocus>
                <input 
                    type="text" 
                    placeholder="Filtrar cotizaciones..." 
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => { setStartDate(e.target.value); handleSearch({ target: { value: searchTerm } }); }}
                />
                <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => { setEndDate(e.target.value); handleSearch({ target: { value: searchTerm } }); }}
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
                                <td>
                                    <select
                                        value={updatedState[quote.id] || quote.estado}
                                        onChange={(e) => handleStateChange(quote.id, e.target.value)}
                                    >
                                            <option value="">- Selecciona -</option>
                                            <option value="Espera">Espera</option>
                                            <option value="Aprobada">Aprobada</option>
                                            <option value="Aprobada sin OC">Aprobada sin OC</option>
                                            <option value="Facturada">Facturada</option>
                                            <option value="Cancelada">Cancelada</option>
                                    </select>
                                </td>
                                <td>$ {quote.total}</td>
                                <td>
                                    <a href="#" onClick={() => openModal(quote.id)}>Editar</a> | 
                                    <a href={`/wp-admin/post.php?post=${quote.id}&action=trash`} className="trash">Eliminar</a> |
                                    <a href="#" onClick={() => handlePreviewClick(quote)}>Ver Cotización</a>
                                </td>
                            </tr>
                        ))}
                        {showPreview && (
                            <PDFPreview pdfUrl={pdfUrl} onClose={handleClosePreview} />
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={closeModal}>X</button>
                        <EditQuote
                            quoteId={selectedQuoteId}
                            onClose={closeModal}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuoteList;
