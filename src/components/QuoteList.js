import React, { useEffect, useState, useMemo } from 'react';
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

    // Cargar cotizaciones al inicio
    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const response = await axios.get(url, {
                    headers: {
                        'content-type': 'application/json',
                        'X-WP-NONCE': appLocalizer.nonce
                    }
                });
                if (response.data && Array.isArray(response.data)) {
                    if (response.data.length === 0) {
                        setError('No se encontraron cotizaciones.');
                    } else {
                        setQuotes(response.data);
                        console.log(response.data);
                        setDisplayedQuotes(response.data.slice(0, visibleCount));
                    }
                } else {
                    setError('Error al leer las cotizaciones');
                }
            } catch (error) {
                setError('Error al recuperar las cotizaciones');
            } finally {
                setLoading(false);
            }
        };

        fetchQuotes();
    }, [url, visibleCount]);

    // Filtrar cotizaciones
    const filteredQuotes = useMemo(() => {
        return quotes.filter(quote => {
            const matchesTerm =
                quote.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                quote.nro_de_cotizacion.toString().includes(searchTerm) ||
                quote.nro_orden.toString().includes(searchTerm) ||
                quote.nro_de_factura.toString().includes(searchTerm);

            const quoteDate = new Date(quote.fecha);
            const matchesDate =
                (!startDate || quoteDate >= new Date(startDate)) &&
                (!endDate || quoteDate <= new Date(endDate));

            return matchesTerm && matchesDate;
        });
    }, [quotes, searchTerm, startDate, endDate]);

    // Actualizar estado de la cotización
    const handleStateChange = async (id, newState) => {
        try {
            await axios.post(`${appLocalizer.apiUrl}/update-quote-state`, {
                id,
                estado: newState
            }, {
                headers: {
                    'content-type': 'application/json',
                    'X-WP-NONCE': appLocalizer.nonce
                }
            });
            setUpdatedState(prevState => ({
                ...prevState,
                [id]: newState
            }));
        } catch (error) {
            console.error('Error al actualizar el estado:', error);
        }
    };

    // Manejo de la vista previa del PDF
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

    // Manejo de búsqueda
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Manejo de fechas
    const handleDateChange = () => {
        setDisplayedQuotes(filteredQuotes.slice(0, visibleCount));
    };

    // Manejo del modal
    const openModal = (quoteId) => {
        setSelectedQuoteId(quoteId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedQuoteId(null);
        setIsModalOpen(false);
    };

    // Manejo del scroll infinito
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
            <div className="search-bar">
                <input 
                    type="text" 
                    placeholder="Filtrar cotizaciones..." 
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => { setStartDate(e.target.value); handleDateChange(); }}
                />
                <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => { setEndDate(e.target.value); handleDateChange(); }}
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
                        {filteredQuotes.slice(0, visibleCount).map((quote) => (
                            <tr key={quote.id}>
                                <td>
                                    <input type="checkbox" />
                                </td>
                                <td>
                                    <strong>
                                        <a href="#" onClick={() => openModal(quote.id)}>
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
                                <td>$ {quote.total_con_iva}</td>
                                <td>
                                    <a href="#" onClick={() => openModal(quote.id)}>Editar</a> | 
                                    <a href="#" className="trash">Eliminar</a> |
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
