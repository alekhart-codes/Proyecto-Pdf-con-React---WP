import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AddQuote.css';

const AddQuote = () => {
    const IVA_PERCENTAGE = 19; // Definimos el porcentaje de IVA

    const [formData, setFormData] = useState({
        nro_orden: '',
        nro_de_cotizacion: '',
        nro_de_factura: '',
        fecha: '',
        cliente: '',
        estado: '',
        items: [{
            producto: '',
            cantidad: '',
            precio_unitario: '',
            precio_total_sin_iva: '',
            iva_total: '',
            total_mas_iva: ''
        }],
        nota: ''
    });

    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    const url = `${appLocalizer.apiUrl}/add-quote`; // URL corregida

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const newItems = formData.items.map((item, i) => (
            i === index ? { ...item, [name]: value } : item
        ));

        // Recalculamos el precio total de cada producto al cambiar cualquier campo
        const updatedItems = newItems.map(item => {
            const cantidad = parseFloat(item.cantidad) || 0;
            const precioUnitario = parseFloat(item.precio_unitario) || 0;
            const precioTotalSinIva = cantidad * precioUnitario;
            const ivaTotal = precioTotalSinIva * (IVA_PERCENTAGE / 100);
            const totalMasIva = precioTotalSinIva + ivaTotal;

            return { 
                ...item, 
                precio_total_sin_iva: precioTotalSinIva.toFixed(2),
                iva_total: ivaTotal.toFixed(2),
                total_mas_iva: totalMasIva.toFixed(2),
                precio: totalMasIva.toFixed(2) // Precio total con IVA
            };
        });

        // Actualiza el estado con los ítems recalculados
        setFormData({ ...formData, items: updatedItems });
    };

    const addNewItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { 
                producto: '', 
                cantidad: '', 
                precio_unitario: '', 
                precio_total_sin_iva: '', 
                iva_total: '', 
                total_mas_iva: '' 
            }]
        });
    };

    const removeItem = (index) => {
        // Confirmar la eliminación
        if (window.confirm('¿Estás seguro de que deseas eliminar esta línea?')) {
            // Solo eliminamos si hay más de una fila en la lista
            if (formData.items.length > 0) {
                setFormData({
                    ...formData,
                    items: formData.items.filter((_, i) => i !== index)
                });
            }
        }
    };
    

    const validateForm = () => {
        const newErrors = {};
        if (!formData.nro_orden) newErrors.nro_orden = 'Nro. de Orden es obligatorio';
        if (!formData.fecha) newErrors.fecha = 'Fecha es obligatoria';
        if (!formData.cliente) newErrors.cliente = 'Cliente es obligatorio';
        if (formData.items.some(item => !item.producto || !item.cantidad || !item.precio_unitario || !item.precio_total_sin_iva || !item.iva_total || !item.total_mas_iva)) {
            newErrors.items = 'Todos los campos de los productos son obligatorios';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const calculateTotals = () => {
        const totalSinIva = formData.items.reduce((sum, item) => sum + parseFloat(item.precio_total_sin_iva || 0), 0);
        const totalIva = formData.items.reduce((sum, item) => sum + parseFloat(item.iva_total || 0), 0);
        const totalConIva = formData.items.reduce((sum, item) => sum + parseFloat(item.total_mas_iva || 0), 0);

        return { totalSinIva, totalIva, totalConIva };
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;
        
        axios.post(
            `${appLocalizer.apiUrl}/add-quote`, 
            formData,
            {
                headers: {
                    'content-type': 'application/json',
                    'X-WP-NONCE': appLocalizer.nonce
                }
            }
        )
        .then(response => {
            if (response.data.status === 'success') {
                setMessage('Cotización enviada con éxito');
                setFormData({
                    nro_orden: '',
                    nro_de_cotizacion: '',
                    nro_de_factura: '',
                    fecha: '',
                    cliente: '',
                    estado: '',
                    items: [{ 
                        producto: '', 
                        cantidad: '', 
                        precio_unitario: '', 
                        precio_total_sin_iva: '', 
                        iva_total: '', 
                        total_mas_iva: '' 
                    }],
                    nota: ''
                });
            } else {
                console.error('Error al guardar la cotización:', response.data.message);
                setMessage('Hubo un problema al enviar la cotización');
            }
        })
        .catch(error => {
            console.error('Error al conectar con la API:', error);
            setMessage('Error al conectar con la API');
        });
    };

    useEffect(() => {
        axios.get(url)
            .then((res) => {
                const data = res.data;
                setFormData({
                    nro_orden: data.nro_orden,
                    nro_de_cotizacion: data.nro_de_cotizacion,
                    nro_de_factura: data.nro_de_factura,
                    fecha: data.fecha,
                    cliente: data.cliente,
                    estado: data.estado,
                    items: data.items || [{ 
                        producto: '', 
                        cantidad: '', 
                        precio_unitario: '', 
                        precio_total_sin_iva: '', 
                        iva_total: '', 
                        total_mas_iva: '' 
                    }],
                    nota: data.nota
                });
            })
            .catch(error => {
                console.error("Error al obtener los datos: ", error);
            });
    }, [url]);

    const { totalSinIva, totalIva, totalConIva } = calculateTotals();

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-column">
                        <div className="form-group">
                            <label htmlFor="nro_orden">Nro. de Orden</label>
                            <input
                                type="text"
                                id="nro_orden"
                                name="nro_orden"
                                value={formData.nro_orden}
                                onChange={handleFormChange}
                            />
                            {errors.nro_orden && <p className="error">{errors.nro_orden}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="nro_de_cotizacion">Nro de Cotización</label>
                            <input
                                type="text"
                                id="nro_de_cotizacion"
                                name="nro_de_cotizacion"
                                value={formData.nro_de_cotizacion}
                                placeholder="Se asignará automáticamente al crear"
                                onChange={handleFormChange}
                                disabled
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="nro_de_factura">Nro de Factura</label>
                            <input
                                type="text"
                                id="nro_de_factura"
                                name="nro_de_factura"
                                value={formData.nro_de_factura}
                                onChange={handleFormChange}
                            />
                        </div>
                    </div>

                    <div className="form-column">
                        <div className="form-group">
                            <label htmlFor="fecha">Fecha</label>
                            <input
                                type="date"
                                id="fecha"
                                name="fecha"
                                value={formData.fecha}
                                onChange={handleFormChange}
                            />
                            {errors.fecha && <p className="error">{errors.fecha}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="cliente">Cliente</label>
                            <input
                                type="text"
                                id="cliente"
                                name="cliente"
                                value={formData.cliente}
                                onChange={handleFormChange}
                            />
                            {errors.cliente && <p className="error">{errors.cliente}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="estado">Estado</label>
                            <select
                                id="estado"
                                name="estado"
                                value={formData.estado}
                                onChange={handleFormChange}
                            >
                                <option value="">- Selecciona -</option>
                                <option value="Espera">Espera</option>
                                <option value="Aprobada">Aprobada</option>
                                <option value="Aprobada sin OC">Aprobada sin OC</option>
                                <option value="Facturada">Facturada</option>
                                <option value="Cancelada">Cancelada</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="items-section">
                    {formData.items.map((item, index) => (
                        <div key={index} className="item-row">
                            <div className="item-col product-col">
                                <div className="form-group">
                                    <label htmlFor={`producto_${index}`}>Producto</label>
                                    <textarea
                                        id={`producto_${index}`}
                                        name="producto"
                                        value={item.producto}
                                        onChange={(e) => handleItemChange(index, e)}
                                    />
                                </div>
                            </div>
                            <div className="item-col other-cols">
                                <div className="form-group">
                                    <label htmlFor={`cantidad_${index}`}>Cantidad</label>
                                    <input
                                        type="text"
                                        id={`cantidad_${index}`}
                                        name="cantidad"
                                        value={item.cantidad}
                                        onChange={(e) => handleItemChange(index, e)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`precio_unitario_${index}`}>Precio Unitario</label>
                                    <input
                                        type="number"
                                        id={`precio_unitario_${index}`}
                                        name="precio_unitario"
                                        value={item.precio_unitario}
                                        onChange={(e) => handleItemChange(index, e)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`precio_${index}`}>Precio + IVA</label>
                                    <input
                                        type="number"
                                        id={`precio_${index}`}
                                        name="precio"
                                        value={item.precio}
                                        readOnly
                                    />
                                </div>
                                {item.producto && (
                                    <button type="button" onClick={() => removeItem(index)}>Eliminar Línea</button>
                                )}
                            </div>
                            {errors.items && <p className="error">{errors.items}</p>}
                        </div>
                    ))}
                    <button type="button" onClick={addNewItem}>Añadir Línea</button>

                    <div className="form-group">
                        <label htmlFor="nota">Nota</label>
                        <textarea
                            id="nota"
                            name="nota"
                            value={formData.nota}
                            onChange={handleFormChange}
                        />
                    </div>
                </div>

                <div className="totals">
                    <div>Total Sin IVA: {totalSinIva.toFixed(2)}</div>
                    <div>IVA ({IVA_PERCENTAGE}%): {totalIva.toFixed(2)}</div>
                    <div>Total con IVA: {totalConIva.toFixed(2)}</div>
                </div>
                
                {message && <p className="confirmation-message">{message}</p>}

                <button type="submit">Guardar</button>
            </form>
        </div>
    );
};

export default AddQuote;
