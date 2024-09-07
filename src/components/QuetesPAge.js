import React, { useState } from 'react';
import PDFPreview from './PDFPreview'; // Asegúrate de que la ruta sea correcta

const QuotesPage = () => {
    const [showPreview, setShowPreview] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');

    const handlePreviewClick = () => {
        // Aquí deberías establecer la URL del PDF que quieres mostrar
        setPdfUrl('URL_DEL_PDF'); // Sustituye con la URL real del PDF
        setShowPreview(true);
    };

    const handleClosePreview = () => {
        setShowPreview(false);
        setPdfUrl('');
    };

    return (
        <div>
            <h1>Listado de Cotizaciones</h1>
            <button onClick={handlePreviewClick}>Ver Vista Previa del PDF</button>

            {showPreview && (
                <PDFPreview pdfUrl={pdfUrl} onClose={handleClosePreview} />
            )}
        </div>
    );
};

export default QuotesPage;
