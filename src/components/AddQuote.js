 // src/components/AddQuote.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PDFPreview from './PDFPreview';

const AddQuote = () => {
    const [cotizaciones, setCotizaciones] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        client_name: '',
        quote_total: '',
        quote_items: ''
    });
    const [pdfUrl, setPdfUrl] = useState(null);

    useEffect(() => {
        // Cargar cotizaciones existentes
        axios.get('/wp-json/wprk/v1/quotes')
            .then(response => setCotizaciones(response.data))
            .catch(error => console.error('Error loading cotizaciones', error));
    }, []);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Envía el formulario y actualiza la lista de cotizaciones
        axios.post('/wp-json/wprk/v1/add-quote', formData)
            .then(response => {
                if (response.data.status === 'success') {
                    setCotizaciones([...cotizaciones, { ...formData, id: response.data.quote_id }]);
                    setFormData({ client_name: '', quote_total: '', quote_items: '' });
                    setShowForm(false);
                } else {
                    console.error('Error saving cotizacion', response.data.message);
                }
            })
            .catch(error => console.error('Error saving cotizacion', error));
    };

    const handleGeneratePdf = (cotizacionId) => {
        axios.get(`/wp-json/wprk/v1/quotes/${cotizacionId}/pdf`)
            .then(response => setPdfUrl(response.data.pdfUrl))
            .catch(error => console.error('Error generating PDF', error));
    };

    return (
        <React.Fragment>
            <div>
                <h2>Cotizaciones</h2>
                {showForm ? (
                    <form onSubmit={handleSubmit}>
                        <table>
                            <tbody>
                                <tr>
                                    <th><label htmlFor="client_name">Cliente</label></th>
                                    <td>
                                        <input
                                            id="client_name"
                                            name="client_name"
                                            value={formData.client_name}
                                            onChange={handleFormChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th><label htmlFor="quote_total">Monto</label></th>
                                    <td>
                                        <input
                                            id="quote_total"
                                            name="quote_total"
                                            type="number"
                                            value={formData.quote_total}
                                            onChange={handleFormChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th><label htmlFor="quote_items">Items</label></th>
                                    <td>
                                        <input
                                            id="quote_items"
                                            name="quote_items"
                                            value={formData.quote_items}
                                            onChange={handleFormChange}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <button type="submit">Guardar</button>
                        <button type="button" onClick={() => setShowForm(false)}>Cancelar</button>
                    </form>
                ) : (
                    <button onClick={() => setShowForm(true)}>Agregar Nueva Cotización</button>
                )}
                <table>
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Monto</th>
                            <th>Items</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cotizaciones.map(cotizacion => (
                            <tr key={cotizacion.id}>
                                <td>{cotizacion.client_name}</td>
                                <td>{cotizacion.quote_total}</td>
                                <td>{cotizacion.quote_items}</td>
                                <td>
                                    <button onClick={() => handleGeneratePdf(cotizacion.id)}>
                                        Generar PDF
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {pdfUrl && <PDFPreview pdfUrl={pdfUrl} />}
            </div>
        </React.Fragment>
    );
};

export default AddQuote;