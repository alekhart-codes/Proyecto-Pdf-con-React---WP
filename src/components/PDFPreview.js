// src/components/PDFPreview.js
import React from 'react';

const PDFPreview = ({ pdfUrl }) => {
    return (
        <div>
            <h3>Vista Previa del PDF</h3>
            {pdfUrl ? (
                <iframe
                    src={pdfUrl}
                    width="100%"
                    height="600px"
                    style={{ border: 'none' }}
                    title="Vista Previa del PDF"
                >
                    Este navegador no soporta iframes.
                </iframe>
            ) : (
                <p>No se ha generado ningún PDF aún.</p>
            )}
        </div>
    );
};

export default PDFPreview;
