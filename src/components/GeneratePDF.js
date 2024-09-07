import { PDFDocument, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';

const generatePdf = async () => {
    // Crear un nuevo documento PDF
    const pdfDoc = await PDFDocument.create();
    
    // Agregar una página al documento
    const page = pdfDoc.addPage([600, 400]);
    const { width, height } = page.getSize();
    
    // Definir una fuente
    const font = await pdfDoc.embedFont(PDFDocument.Font.Helvetica);
    
    // Agregar texto al documento
    page.drawText('N° Cotización: 18037', {
        x: 50,
        y: height - 50,
        size: 20,
        font: font,
        color: rgb(0, 0, 0),
    });
    
    // Puedes agregar más contenido al PDF según tus necesidades
    page.drawText('Item Producto Cant. Precio Unit. Precio', {
        x: 50,
        y: height - 100,
        size: 15,
        font: font,
        color: rgb(0, 0, 0),
    });
    
    // Aquí puedes agregar todos los ítems
    // Por ejemplo:
    page.drawText('1 Desarme de tabiques... $260.000 $260.000', {
        x: 50,
        y: height - 130,
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
    });
    
    // Agregar más ítems de manera similar
    
    // Agregar un pie de página
    page.drawText('Fecha: 23 de Agosto 2024', {
        x: 50,
        y: 50,
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
    });

    // Serializar el PDF
    const pdfBytes = await pdfDoc.save();
    
    // Crear un URL para el PDF
    const pdfUrl = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));

    // Mostrar el PDF en el iframe
    return pdfUrl;
};

export default generatePdf;
