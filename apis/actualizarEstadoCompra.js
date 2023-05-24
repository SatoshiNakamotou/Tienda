// Importamos el módulo de express y router
const express = require('express');
const router = express.Router();

// Importamos el archivo de configuración de la base de datos de la tienda
const pool_tienda = require('../dbconfig/dbconfig_tienda');

// Este endpoint actualiza el estado de la compra después de realizar la validación de la tarjeta
router.put('/:codigoCarrito', async (req, res) => {
    try {
        // Obtenemos el código del carrito de la URL y el nuevo estado y el detalle de la solicitud
        const { codigoCarrito } = req.params;
        const { estado, detalleTransaccion } = req.body;

        // Imprimimos los valores que recibimos para verificar que están correctos
        console.log(`codigoCarrito: ${codigoCarrito}, estado: ${estado}, detalleTransaccion: ${detalleTransaccion}`);

        // Actualizamos el estado y el detalle de la transacción en la base de datos
        // Usamos la conexión con la base de datos de la tienda
        const query = `
            UPDATE carritoCompra 
            SET estado = $1, detalleTransaccion = $2 
            WHERE codigoCarritoCompra = $3`;
        const result = await pool_tienda.query(query, [estado, detalleTransaccion, codigoCarrito]);

        // Imprimimos el resultado de la consulta para verificar que se realizó correctamente
        console.log('Resultado de la consulta:', result);

        // Respondemos con un mensaje de éxito
        res.status(200).json({ mensaje: 'Estado de compra actualizado con éxito.' });

    } catch (error) {
        // Si algo sale mal, enviamos un mensaje de error
        console.log('Error al actualizar el estado de la compra:', error);  // Aquí imprimimos el error
        res.status(500).json({ mensaje: 'Error al actualizar el estado de la compra.' });
    }
});

module.exports = router;