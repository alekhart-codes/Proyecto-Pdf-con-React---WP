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
            precio: ''
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
        setFormData({ ...formData, items: newItems });
    };

    const addNewItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { producto: '', cantidad: '', precio_unitario: '', precio: '' }]
        });
    };

    const removeItem = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
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

        const updatedQuote = {
            ...formData,
            totalSinIva: formData.items.reduce((total, item) => total + parseFloat(item.precio_unitario * item.cantidad || 0), 0),
            totalIva: formData.items.reduce((total, item) => total + parseFloat(item.precio_unitario * item.cantidad * IVA_PERCENTAGE / 100 || 0), 0),
            totalConIva: formData.items.reduce((total, item) => total + parseFloat(item.precio_unitario * item.cantidad * (1 + IVA_PERCENTAGE / 100) || 0), 0),
        };

        axios.post(`${appLocalizer.apiUrl}/update-quote/${quoteId}`, updatedQuote)
            .then(() => {
                setMessage('Cotización actualizada con éxito');
            })
            .catch((error) => {
                console.error('Error al actualizar cotización:', error);
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
                totalSinIva={formData.items.reduce((total, item) => total + parseFloat(item.precio_unitario * item.cantidad || 0), 0)}
                totalIva={formData.items.reduce((total, item) => total + parseFloat(item.precio_unitario * item.cantidad * IVA_PERCENTAGE / 100 || 0), 0)}
                totalConIva={formData.items.reduce((total, item) => total + parseFloat(item.precio_unitario * item.cantidad * (1 + IVA_PERCENTAGE / 100) || 0), 0)}
                IVA_PERCENTAGE={IVA_PERCENTAGE}
                handleSubmit={handleSubmit}
                message={message}
            />
        </Modal>
    );
};

export default EditQuote;
