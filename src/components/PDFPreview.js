import React from 'react';
import './PDFPreview.css';

const PDFPreview = ({ pdfUrl, onClose }) => {
    return (
        <div className="pdf-preview-overlay">
            <div className="pdf-preview-modal">
                <button className="close-btn" onClick={onClose}>X</button>
                <iframe
                    src={pdfUrl}
                    width="100%"
                    height="100%"
                    title="PDF Preview"
                ></iframe>
            </div>
        </div>
    );
};

export default PDFPreview;
