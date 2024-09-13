import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from './Modal'; // Asegúrate de que la ruta sea correcta
import './EditQuote.css';

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

    const validateForm = () => {
        const newErrors = {};
        if (!formData.nro_orden) newErrors.nro_orden = 'Nro. de Orden es obligatorio';
        if (!formData.fecha) newErrors.fecha = 'Fecha es obligatoria';
        if (!formData.cliente) newErrors.cliente = 'Cliente es obligatorio';
        if (formData.items.some(item => !item.producto || !item.cantidad || !item.precio_unitario || !item.precio)) {
            newErrors.items = 'Todos los campos de los productos son obligatorios';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        axios.put(
            `${appLocalizer.apiUrl}/quotes/${quoteId}`,
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
                console.log('Cotización actualizada con éxito:', response.data);
                onClose(); // Cierra el modal después de guardar
            } else {
                console.error('Error al actualizar la cotización:', response.data.message);
            }
        })
        .catch(error => {
            console.error('Error al conectar con la API:', error);
        });
    };

    return (
        <Modal isOpen={!!quoteId} onClose={onClose}>
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

                <div className="full-width">
                    {formData.items.map((item, index) => (
                        <div key={index} className="form-group item-group">
                            <div className="form-group">
                                <label htmlFor={`producto_${index}`}>Producto</label>
                                <textarea
                                    id={`producto_${index}`}
                                    name="producto"
                                    value={item.producto}
                                    onChange={(e) => handleItemChange(index, e)}
                                />
                            </div>
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
                                <label htmlFor={`precio_${index}`}>Precio</label>
                                <input
                                    type="number"
                                    id={`precio_${index}`}
                                    name="precio"
                                    value={item.precio}
                                    onChange={(e) => handleItemChange(index, e)}
                                />
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

                <button type="submit">Actualizar</button>
            </form>
        </Modal>
    );
};

export default EditQuote;
