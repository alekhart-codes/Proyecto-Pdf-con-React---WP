import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from './Modal';
import './EditQuote.css';
import Quote from './Quote';

const EditQuote = ({ quoteId, onClose }) => {
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

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const IVA_PERCENTAGE = 19; // Porcentaje de IVA en Chile

    useEffect(() => {
        if (quoteId) {
            axios.get(`${appLocalizer.apiUrl}/get-quote/${quoteId}`)
                .then(res => {
                    setFormData(res.data);
                })
                .catch(error => {
                    console.error('Error al obtener los datos:', error);
                });
        }
    }, [quoteId]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const newItems = formData.items.map((item, i) => (
            i === index ? { ...item, [name]: value } : item
        ));

        const updatedItems = newItems.map(item => {
            const cantidad = parseFloat(item.cantidad) || 0;
            const precioUnitario = parseFloat(item.precio_unitario) || 0;
            const precioTotalSinIva = cantidad * precioUnitario;
            const ivaTotal = precioTotalSinIva * (IVA_PERCENTAGE / 100);
            const totalMasIva = precioTotalSinIva + ivaTotal;

            return { 
                ...item, 
                precio_total_sin_iva: precioTotalSinIva,
                iva_total: ivaTotal,
                total_mas_iva: totalMasIva,
            };
        });

        setFormData({ ...formData, items: updatedItems });
    };
    
    const addNewItem = () => {
        const lastItem = formData.items[formData.items.length - 1];

        if (!lastItem.producto || !lastItem.cantidad || !lastItem.precio_unitario) {
            setErrors({
                ...errors,
                items: 'Por favor completa el producto actual antes de agregar uno nuevo'
            });
            return;
        }
        setErrors({ ...errors, items: '' });
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
        if (window.confirm('¿Estás seguro de que deseas eliminar esta línea?')) {
            if (formData.items.length > 1) {
                setFormData({
                    ...formData,
                    items: formData.items.filter((_, i) => i !== index)
                });
            } else {
                alert('Debes mantener al menos una línea en la lista.');
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.nro_orden) newErrors.nro_orden = 'Nro. de Orden es obligatorio';
        if (!formData.fecha) newErrors.fecha = 'Fecha es obligatoria';
        if (!formData.cliente) newErrors.cliente = 'Cliente es obligatorio';
        if (formData.items.some(item => !item.producto || !item.cantidad || !item.precio_unitario || parseFloat(item.precio_unitario) < 100)) {
            newErrors.items = 'Todos los productos deben tener nombre, cantidad y precio unitario de minimo $100 pesos';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const roundNumber = (num) => {
        if (num === 5 || num === 10) return num; // Si es 5 o 10, no lo redondea
        return Math.round(num); // Redondea al número entero más cercano
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        // Calculamos los totales generales
        const totalSinIva = roundNumber(formData.items.reduce((total, item) => {
            const precioTotalSinIva = parseFloat(item.precio_total_sin_iva) || 0;
            return total + precioTotalSinIva;
        }, 0)) || 0;

        const totalIva = roundNumber(formData.items.reduce((total, item) => {
            const ivaTotal = parseFloat(item.iva_total) || 0;
            return total + ivaTotal;
        }, 0)) || 0;

        const totalConIva = roundNumber(formData.items.reduce((total, item) => {
            const totalMasIva = parseFloat(item.total_mas_iva) || 0;
            return total + totalMasIva;
        }, 0)) || 0;

        const updatedQuote = {
            ...formData,
            total_sin_iva: totalSinIva,
            total_iva: totalIva,
            total_con_iva: totalConIva
        };

        axios.post(`${appLocalizer.apiUrl}/update-quote/${quoteId}`, updatedQuote, {
            headers: {
                'content-type': 'application/json',
                'X-WP-NONCE': appLocalizer.nonce
            }
        })
        .then(() => {
            setMessage('Cotización actualizada con éxito');
            
        })
        .catch((error) => {
            console.error('Error al actualizar cotización:', error);
            setMessage('Error al actualizar cotización');
        }); 
    };

    // Cálculo de totales en el render
    const totalSinIva = roundNumber(formData.items.reduce((total, item) => {
        const precioTotalSinIva = parseFloat(item.precio_total_sin_iva) || 0;
        return total + precioTotalSinIva;
    }, 0)) || 0;

    const totalIva = roundNumber(formData.items.reduce((total, item) => {
        const ivaTotal = parseFloat(item.iva_total) || 0;
        return total + ivaTotal;
    }, 0)) || 0;

    const totalConIva = roundNumber(formData.items.reduce((total, item) => {
        const totalMasIva = parseFloat(item.total_mas_iva) || 0;
        return total + totalMasIva;
    }, 0)) || 0;

    return (
        <Modal onClose={onClose}>
            <h2>Editar Cotización</h2>
            <Quote
                formData={formData}
                errors={errors}
                handleFormChange={handleFormChange}
                handleItemChange={handleItemChange}
                addNewItem={addNewItem}
                removeItem={removeItem}
                totalSinIva={totalSinIva}
                totalIva={totalIva}
                totalConIva={totalConIva}              
                handleSubmit={handleSubmit}
                message={message}
            />
        </Modal>
    );
};

export default EditQuote;
