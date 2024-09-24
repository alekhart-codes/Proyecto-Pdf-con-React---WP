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

      <div className="items-container">
        <h3>Productos</h3>
        {formData.items.map((item, index) => (
          <div key={index} className="item-row">
            <input
              type="text"
              name="producto"
              placeholder="Producto"
              value={item.producto}
              onChange={(e) => handleItemChange(index, e)}
            />
            <input
              type="number"
              name="cantidad"
              placeholder="Cantidad"
              value={item.cantidad}
              onChange={(e) => handleItemChange(index, e)}
            />
            <input
              type="number"
              name="precio_unitario"
              placeholder="Precio Unitario"
              value={item.precio_unitario}
              onChange={(e) => handleItemChange(index, e)}
            />
            <input
              type="text"
              name="precio_total_sin_iva"
              placeholder="Precio total Neto"
              value={item.precio_total_sin_iva}
              readOnly
            />
            
            <button type="button" onClick={() => removeItem(index)}>Eliminar</button>
          </div>
        ))}
        {errors.items && <p className="error">{errors.items}</p>}
        <button type="button" onClick={addNewItem}>Agregar Producto</button>
      </div>

      <div className="totals">
        <div>Sub Total: {totalSinIva}</div>
        <div>IVA: {totalIva}</div>
        <div>Total: {totalConIva}</div>
      </div>

      <div className="form-group">
        <label htmlFor="nota">Nota</label>
        <textarea
          id="nota"
          name="nota"
          value={formData.nota}
          onChange={handleFormChange}
        />
      </div>

      <div className="form-group">
        <button type="submit">Actualizar Cotización</button>
      </div>

      {message && <p className="message">{message}</p>}
    </form>
  );
};

export default Quote;
