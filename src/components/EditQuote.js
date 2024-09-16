import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from './Modal';
import './EditQuote.css';
import Quote from './Quote';

const EditQuote = ({ quoteId, onClose, onSave }) => {

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
    const IVA_PERCENTAGE = 19; // Porcentaje de IVA en Chile (puedes ajustar)

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
                precio_total_sin_iva: precioTotalSinIva.toFixed(2),
                iva_total: ivaTotal.toFixed(2),
                total_mas_iva: totalMasIva.toFixed(2),
                precio: totalMasIva.toFixed(2)
            };
        });

        setFormData({ ...formData, items: updatedItems });
    };
    
    const addNewItem = () => {

    const lastItem = formData.items[formData.items.length - 1];

        if (!lastItem.producto || !lastItem.cantidad || !lastItem.precio_unitario) {
            setErrors({
                ...errors,
                items: 'Porfavor completa el producto actual antes de agregar uno nuevo'
        });
        return;
    }
        setErrors({...errors, items:''});
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
        if (formData.items.some(item => !item.producto || !item.cantidad || !item.precio_unitario)) {
            newErrors.items = 'Todos los productos deben tener nombre, cantidad y precio unitario';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        // Calculamos los totales generales
        const totalSinIva = formData.items.reduce((total, item) => total + parseFloat(item.precio_total_sin_iva || 0), 0);
        const totalIva = formData.items.reduce((total, item) => total + parseFloat(item.iva_total || 0), 0);
        const totalConIva = formData.items.reduce((total, item) => total + parseFloat(item.total_mas_iva || 0), 0);

        const updatedQuote = {
            ...formData,
            total_sin_iva: totalSinIva.toFixed(2),
            total_iva: totalIva.toFixed(2),
            total_con_iva: totalConIva.toFixed(2)
        };

        axios.post(`${appLocalizer.apiUrl}/update-quote/${quoteId}`, updatedQuote, {
            headers: {
                'content-type': 'application/json',
                'X-WP-NONCE': appLocalizer.nonce
            }
        })
        .then(()=>{
            setMessage('Cotización actualizada con éxito');
        })
        .catch((error) => {
            console.error('Error al actualizar cotización:', error);
            setMessage('Error al actualizar cotización');
        }); 
    };

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
                totalSinIva={formData.items.reduce((total, item) => total + parseFloat(item.precio_total_sin_iva || 0), 0)}
                totalIva={formData.items.reduce((total, item) => total + parseFloat(item.iva_total || 0), 0)}
                totalConIva={formData.items.reduce((total, item) => total + parseFloat(item.total_mas_iva || 0), 0)}
                IVA_PERCENTAGE={IVA_PERCENTAGE}
                handleSubmit={handleSubmit}
                message={message}
            />
        </Modal>
    );
};

export default EditQuote;
