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
            precio: '',
            precio_total_sin_iva: '',
            iva_total: '',
            total_mas_iva: ''
        }],
        nota: ''
    });

    const [totals, setTotals] = useState({
        totalSinIva: 0,
        totalIva: 0,
        totalConIva: 0
    });

    const IVA_PERCENTAGE = 19; // Porcentaje de IVA en Chile (puedes ajustar)

    // Obtener los datos de la cotización al cargar el componente
    useEffect(() => {
        if (quoteId) {
            axios.get(`${appLocalizer.apiUrl}/get-quote/${quoteId}`)
                .then(res => {
                    console.log('Datos de la cotización:', res.data);
                    setFormData(res.data);
                })
                .catch(error => {
                    console.error('Error al obtener los datos:', error);
                });
        }
    }, [quoteId]);

    // Recalcular los totales cada vez que cambien los items
    useEffect(() => {
        const totalSinIva = formData.items.reduce((total, item) => total + parseFloat(item.precio_unitario || 0) * parseFloat(item.cantidad || 0), 0);
        const totalIva = totalSinIva * (IVA_PERCENTAGE / 100);
        const totalConIva = totalSinIva + totalIva;

        setTotals({
            totalSinIva,
            totalIva,
            totalConIva
        });
    }, [formData.items]); // Se recalcula cuando cambian los items

    // Función para manejar los cambios en los inputs del formulario principal
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Función para manejar los cambios en los items (productos)
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
        if (window.confirm('¿Estás seguro de que deseas eliminar esta línea?')) {
            if (formData.items.length > 1) {
                setFormData({
                    ...formData,
                    items: formData.items.filter((_, i) => i !== index)
                });
            } else {
                alert('Debe haber al menos un elemento en la lista.');
            }
        }
    };

    // Validar el formulario antes de enviar
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
            totalSinIva: totals.totalSinIva,
            totalIva: totals.totalIva,
            totalConIva: totals.totalConIva,
        };

        axios.post(`${appLocalizer.apiUrl}/update-quote/${quoteId}`, updatedQuote,
            {headers: {
                'content-type' : 'application/json',
                'X-WP-NONCE': appLocalizer.nonce
            }})
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
                totalSinIva={totals.totalSinIva}
                totalIva={totals.totalIva}
                totalConIva={totals.totalConIva}
                IVA_PERCENTAGE={IVA_PERCENTAGE}
                handleSubmit={handleSubmit}
                message={message}
            />
        </Modal>
    );
};

export default EditQuote;
