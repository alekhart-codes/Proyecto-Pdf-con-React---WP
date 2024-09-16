import React from "react";

const Quote = ({
  formData,
  errors,
  handleFormChange,
  handleItemChange,
  addNewItem,
  removeItem,
  totalSinIva,
  totalIva,
  totalConIva,
  IVA_PERCENTAGE,
  handleSubmit,
  message,
}) => {
  return (
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
                                
                                    <button type="button" onClick={() => removeItem(index)}>Eliminar Línea</button>
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
  );
};

export default Quote;
