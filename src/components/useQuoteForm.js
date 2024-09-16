import { useState, useEffect } from 'react';
import axios from 'axios';

const useQuoteForm = (initialData, apiUrl, quoteId = null) => {
    const [formData, setFormData] = useState(initialData);
    const [totals, setTotals] = useState({
        totalSinIva: 0,
        totalIva: 0,
        totalConIva: 0
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    const IVA_PERCENTAGE = 19; // Porcentaje de IVA en Chile (puedes ajustar)

    useEffect(() => {
        if (quoteId) {
            axios.get(`${apiUrl}/get-quote/${quoteId}`)
                .then(res => setFormData(res.data))
                .catch(error => console.error('Error al obtener los datos:', error));
        }
    }, [quoteId, apiUrl]);

    useEffect(() => {
        const updatedItems = formData.items.map(item => {
            const precio = parseFloat(item.precio_unitario || 0) * parseFloat(item.cantidad || 0);
            return { ...item, precio };
        });
        setFormData({ ...formData, items: updatedItems });
    }, [formData.items]);

    useEffect(() => {
        const totalSinIva = formData.items.reduce((total, item) => total + parseFloat(item.precio_unitario || 0) * parseFloat(item.cantidad || 0), 0);
        const totalIva = totalSinIva * (IVA_PERCENTAGE / 100);
        const totalConIva = totalSinIva + totalIva;

        setTotals({
            totalSinIva,
            totalIva,
            totalConIva
        });
    }, [formData.items]);

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

    const handleSubmit = (submitUrl, quoteId = null) => {
        return (e) => {
            e.preventDefault();
            if (!validateForm()) return; // Aquí se llama a validateForm

            const updatedQuote = {
                ...formData,
                totalSinIva: totals.totalSinIva,
                totalIva: totals.totalIva,
                totalConIva: totals.totalConIva,
            };

            const url = quoteId ? `${submitUrl}/${quoteId}` : submitUrl;
            axios.post(url, updatedQuote, {
                headers: {
                    'content-type': 'application/json',
                    'X-WP-NONCE': appLocalizer.nonce
                }
            })
            .then(() => {
                setMessage('Cotización guardada con éxito');
                if (!quoteId) {
                    setFormData(initialData); // Resetear datos si es nueva cotización
                }
            })
            .catch((error) => {
                console.error('Error al conectar con la API:', error);
                setMessage('Error al conectar con la API');
            });
        };
    };

    return {
        formData,
        totals,
        errors,
        message,
        handleFormChange,
        handleItemChange,
        addNewItem,
        removeItem,
        validateForm,
        handleSubmit
    };
};

export default useQuoteForm;
