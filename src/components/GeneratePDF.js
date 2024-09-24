import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import headerImg from '../header.png';

const generatePdf = async (quote) => {
    try {
        const pdfDoc = await PDFDocument.create();
        const imageBytes = await fetch(headerImg).then(res => res.arrayBuffer());
        const image = await pdfDoc.embedPng(imageBytes);
        
        // Supongamos que `formData.nota` contiene la nota que deseas agregar
        const note = quote.nota || '';

        const drawLineUnderText = (page, x, y) => {
            page.drawLine({
                start: { x, y },
                end: { x: x + 500, y }, // Ajusta la longitud según sea necesario
                color: rgb(0, 0, 0), // Color de la línea (negro en este caso)
                thickness: 1, // Grosor de la línea
            });
        };

        // Inicializar variables
        let page = pdfDoc.addPage([600, 700]);
        const { width, height } = page.getSize();
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
        const rowHeight = 20; // Aumentar la altura de fila para mayor claridad

        // Función para dividir el texto en líneas
        const splitTextIntoLines = (text, maxLength) => {
            const words = text.split(' ');
            let lines = [];
            let currentLine = '';

            words.forEach((word) => {
                // Verifica si agregar la palabra excede la longitud máxima
                if (currentLine.length + word.length + 1 <= maxLength) {
                    currentLine += (currentLine ? ' ' : '') + word;
                } else {
                    // Si es así, agrega la línea actual a las líneas y comienza una nueva
                    lines.push(currentLine);
                    currentLine = word;
                }
            });

            // Agregar la última línea si hay contenido
            if (currentLine) {
                lines.push(currentLine);
            }

            return lines;
        };

        const noteLines = splitTextIntoLines(note, 55);
        
        // Agregar imagen en la primera página
        const imageWidth = 480;
        const imageHeight = 100;
        page.drawImage(image, {
            x: width - imageWidth - 50,
            y: height - imageHeight,
            width: imageWidth,
            height: imageHeight,
        });

        // Definir la posición inicial para el contenido
        let yPosition = height - imageHeight - 60;

        // Información principal de la cotización
        const drawQuoteInfo = () => {
            page.drawText(`N° Cotización: ${quote.nro_de_cotizacion}`, { x: 50, y: yPosition, size: 14, font: timesRomanFont, color: rgb(0, 0, 0) });
            yPosition -= 12;
            page.drawText(`Cliente: ${quote.title}`, { x: 50, y: yPosition, size: 12, font: timesRomanFont, color: rgb(0, 0, 0) });
            yPosition -= 16;
            page.drawText(`Fecha: ${quote.fecha}`, { x: 50, y: yPosition, size: 11, font: timesRomanFont, color: rgb(0, 0, 0) });
            yPosition -= 16; // Ajusta el espacio después de la información
        };
        
        drawQuoteInfo();

        // Dibujar encabezado de la tabla
        const drawTableHeader = (page, startY) => {
            const headerY = startY - 11; // Ajustar posición del encabezado
            page.drawText('Item', { x: 50, y: headerY, size: 12, font: timesRomanFont, color: rgb(0, 0, 0) });
            page.drawText('Producto', { x: 80, y: headerY, size: 12, font: timesRomanFont, color: rgb(0, 0, 0) });
            page.drawText('Cantidad', { x: 352, y: headerY, size: 12, font: timesRomanFont, color: rgb(0, 0, 0) });
            page.drawText('Precio', { x: 417, y: headerY, size: 12, font: timesRomanFont, color: rgb(0, 0, 0) });
            page.drawText('Total', { x: 480, y: headerY, size: 12, font: timesRomanFont, color: rgb(0, 0, 0) });
            return headerY; // Retorna la posición Y del encabezado
        };

        const addProductsToPage = (page, productos, startY) => {
            let currentY = startY;
        
            const addRow = (index, prod) => {
                const rowY = currentY - rowHeight; // Ajustar el cálculo para las filas
                page.drawText(`${index + 1}`, { x: 50, y: rowY, size: 10, font: timesRomanFont, color: rgb(0, 0, 0) });
                
                page.drawText(prod.producto.length > 60 ? `${prod.producto.substring(0, 60)}...` : prod.producto, { x: 80, y: rowY, size: 10, font: timesRomanFont, color: rgb(0, 0, 0) });                 

                page.drawText(`${prod.cantidad}`, { x: 352, y: rowY, size: 10, font: timesRomanFont, color: rgb(0, 0, 0) });
                page.drawText(`$${prod.precio_unitario}`, { x: 417, y: rowY, size: 10, font: timesRomanFont, color: rgb(0, 0, 0) });
                page.drawText(`$${prod.precio}`, { x: 480, y: rowY, size: 10, font: timesRomanFont, color: rgb(0, 0, 0) });

                return rowY; // Retorna la posición Y de la fila
            };
        
            productos.forEach((prod, index) => {
                // Comprobar si hay suficiente espacio para la fila actual
                if (currentY - rowHeight < 50) { // Si el espacio es insuficiente, agregar nueva página
                    page = pdfDoc.addPage([600, 700]);
                    currentY = height - 60; // Reiniciar la posición y
                    drawTableHeader(page, currentY);
                }
                currentY = addRow(index, prod);
            });
            return currentY; // Retornar la nueva posición Y
        };
        
        // Dibujar encabezado de la tabla y agregar productos
        const headerY = drawTableHeader(page, yPosition);
        drawLineUnderText(page, 50, yPosition - 15); // Dibuja una línea debajo del texto en (50, yPosition - 3)

        yPosition = headerY - 6; // Espacio después del encabezado para los productos
        yPosition = addProductsToPage(page, quote.items, yPosition);

        // Ajustar la posición Y para el texto de la nota
        yPosition -= 60;
            
        // Dibuja la etiqueta "Nota: " en su propia línea
        page.drawText(`Nota:`, { x: 50, y: yPosition, size: 12, font: timesRomanFont, color: rgb(0, 0, 0) });
        yPosition -= 15; // Mover hacia abajo para la primera línea de la nota

        // Dibujar cada línea del contenido de la nota
        noteLines.forEach(line => {
            page.drawText(line, { x: 50, y: yPosition, size: 12, font: timesRomanFont, color: rgb(0, 0, 0) });
            yPosition -= 30; // Ajustar el espacio entre líneas según necesites
        });

        // Espacio antes del resumen final
        yPosition -= 44; // Espacio adicional antes de los totales

        // Calcular y mostrar Neto, IVA y Total
        page.drawText(`Sub Total: $${quote.total_sin_iva}`, { x: 417, y: yPosition, size: 15, font: timesRomanFont, color: rgb(0, 0, 0) });
        yPosition -= 20;
        page.drawText(`IVA: $${quote.total_iva}`, { x: 417, y: yPosition, size: 15, font: timesRomanFont, color: rgb(0, 0, 0) });
        yPosition -= 20;
        page.drawText(`Total: $${quote.total_con_iva}`, { x: 417, y: yPosition, size: 15, font: timesRomanFont, color: rgb(0, 0, 0) });

        // Luego, agrega el texto de validez
        yPosition -= 44; // Ajusta para separar la nota de la validez
        page.drawText(`Validez de la cotización: 15 días a partir de la fecha de emisión.`, { x: 100, y: yPosition, size: 12, font: timesRomanFont, color: rgb(0, 0, 0) });

        // Serializar el PDF
        const pdfBytes = await pdfDoc.save();
        const pdfUrl = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
        
        return pdfUrl;
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        throw error;
    }
};

export default generatePdf;
