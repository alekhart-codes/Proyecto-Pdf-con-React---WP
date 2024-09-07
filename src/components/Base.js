import React, { useState } from 'react';
import generatePdf from './GeneratePDF'; // Asegúrate de importar la función
import './Base.css'; // Importa el archivo de estilos
import PDFPreview from './PDFPreview';

const Base = () => {
    const [showPreview, setShowPreview] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');

    const handlePreviewClick = async () => {
        try {
            const url = await generatePdf();
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

    return (
        <div>
            <header className="header">
                <div className="logo">Mi Aplicación</div>
                <div className="search-bar">
                    <input type="text" placeholder="Buscar cotizaciones..." />
                </div>
                <div className="user-settings">
                    <span>Usuario</span>
                    <span>Configuración</span>
                </div>
            </header>
            <nav className="nav">
                <a href="#">Cotizaciones</a>
                <a href="#">Clientes</a>
                <a href="#">Reportes</a>
                <a href="#">Configuración</a>
            </nav>
            <main className="main-content">
                <div className="search-bar">
                    <input type="text" placeholder="Buscar cotizaciones..." />
                </div>
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
                        <tr>
                            <td><input type="checkbox" /></td>
                            <td><a href="#">Cotización 1</a></td>
                            <td>123</td>
                            <td>456</td>
                            <td>789</td>
                            <td>Activa</td>
                            <td>$1000</td>
                            <td>
                                <a href="#">Editar</a> | 
                                <a href="#" className="trash">Eliminar</a> |
                                <button onClick={handlePreviewClick}>Ver Cotización</button>
                            </td>
                        </tr>
                        {/* Más filas aquí */}
                    </tbody>
                </table>
            </main>
            <footer className="footer">
                &copy; 2024 Mi Aplicación. Todos los derechos reservados.
            </footer>

            {showPreview && (
                <PDFPreview pdfUrl={pdfUrl} onClose={handleClosePreview} />
            )}
        </div>
    );
}

export default Base;
