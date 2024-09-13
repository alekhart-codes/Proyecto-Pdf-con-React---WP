import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import headerImg from '../header.png';

const generatePdf = async (quote) => {
    try {
        // Crear un nuevo documento PDF
        const pdfDoc = await PDFDocument.create();
        
        // Cargar la imagen (debe ser una URL o un blob de imagen)        
        const imageBytes = await fetch(headerImg).then(res => res.arrayBuffer());
        const image = await pdfDoc.embedPng(imageBytes);

        // Agregar una página al documento
        const page = pdfDoc.addPage([600, 700]); // Ajustar tamaño de la página para contenido más largo
        const { width, height } = page.getSize();

        // Definir una fuente
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

        // Agregar imagen
        const imageWidth = 480;
        const imageHeight = 100;
        page.drawImage(image, {
            x: width - imageWidth - 50, // Ajusta la posición de la imagen
            y: height - imageHeight - 0,
            width: imageWidth,
            height: imageHeight,
        });

        // Definir la posición inicial para el contenido
        let yPosition = height - imageHeight - 60; // Ajustar posición para el contenido

        // Información principal de la cotización
        page.drawText(`N° Cotización: ${quote.nro_de_cotizacion}`, {
            x: 50,
            y: yPosition,
            size: 20,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
        });
        yPosition -= 30;

        page.drawText(`Cliente: ${quote.title}`, {
            x: 50,
            y: yPosition,
            size: 15,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
        });
        yPosition -= 30;

        // Añadir los productos de la cotización
        const productos = quote.items; // Asegúrate de que 'items' contenga la lista de productos
        
        // Define table dimensions
        const tableStartY = yPosition ; // Sube la tabla al ajustar este valor
        const rowHeight = 20;
        const columnWidths = [25, 275, 65, 65, 65]; // Ajusta según el contenido

        // Dibujar encabezado de la tabla
        page.drawText('Item', { x: 50, y: tableStartY - 10, size: 12, font: timesRomanFont, color: rgb(0, 0, 0) });
        page.drawText('Producto', { x: 80, y: tableStartY - 10, size: 12, font: timesRomanFont, color: rgb(0, 0, 0) });
        page.drawText('Cant.', { x: 352, y: tableStartY - 10, size: 12, font: timesRomanFont, color: rgb(0, 0, 0) });
        page.drawText('Precio Unit.', { x: 412, y: tableStartY- 10, size: 12, font: timesRomanFont, color: rgb(0, 0, 0) });
        page.drawText('Total + iva', { x: 475, y: tableStartY - 10, size: 12, font: timesRomanFont, color: rgb(0, 0, 0) });

        // Dibujar líneas de la tabla
        const tableWidth = columnWidths.reduce((a, b) => a + b, 0);
        page.drawRectangle({ x: 50, y: tableStartY - rowHeight, width: tableWidth, height: rowHeight, borderColor: rgb(0, 0, 0), borderWidth: 1 });
        page.drawRectangle({ x: 50, y: tableStartY - rowHeight - rowHeight * (productos.length + 1), width: tableWidth, height: rowHeight * (productos.length + 1), borderColor: rgb(0, 0, 0), borderWidth: 1 });
        
        // Dibujar líneas verticales
        let xPos = 50;
        for (let i = 0; i < columnWidths.length - 1; i++) {
            xPos += columnWidths[i];
            page.drawLine({ start: { x: xPos, y: tableStartY - rowHeight * (productos.length + 1) }, end: { x: xPos, y: tableStartY }, color: rgb(0, 0, 0), thickness: 1 });
        }

        // Recorrer los productos para dibujar cada fila
        productos.forEach((prod, index) => {
            const rowY = tableStartY - rowHeight * (index + 2);

            page.drawText(`${index + 1}`, { x: 50, y: rowY, size: 10, font: timesRomanFont, color: rgb(0, 0, 0) });
            page.drawText(`${prod.producto}`, { x: 80, y: rowY, size: 10, font: timesRomanFont, color: rgb(0, 0, 0), maxWidth: columnWidths[1] });
            page.drawText(`${prod.cantidad}`, { x: 352, y: rowY, size: 10, font: timesRomanFont, color: rgb(0, 0, 0) });
            page.drawText(`$${Number(prod.precio_unitario).toLocaleString()}`, { x: 412, y: rowY, size: 10, font: timesRomanFont, color: rgb(0, 0, 0) });
            page.drawText(`$${Number(prod.precio).toLocaleString()}`, { x: 475, y: rowY, size: 10, font: timesRomanFont, color: rgb(0, 0, 0) });
        });

        // Espacio antes del resumen final
        yPosition = tableStartY - rowHeight * (productos.length + 2) - 150;

        // Calcular y mostrar Neto, IVA y Total
        page.drawText(`Neto: $${Number(quote.neto).toLocaleString()}`, {
            x: 150,
            y: yPosition,
            size: 15,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
        });
        yPosition -= 20;

        page.drawText(`IVA (19%): $${Number(quote.iva).toLocaleString()}`, {
            x: 150,
            y: yPosition,
            size: 15,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
        });
        yPosition -= 20;

        page.drawText(`Total: $${Number(quote.total).toLocaleString()}`, {
            x: 150,
            y: yPosition,
            size: 15,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
        });

        // Serializar el PDF
        const pdfBytes = await pdfDoc.save();

        // Crear un URL para el PDF
        const pdfUrl = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));

        return pdfUrl;
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        throw error;
    }
};

export default generatePdf;
