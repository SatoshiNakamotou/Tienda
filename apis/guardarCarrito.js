// Importamos el módulo de express y router
const express = require('express');
const router = express.Router();

// Importamos el archivo de configuración de la base de datos de la tienda
const pool_tienda = require('../dbconfig/dbconfig_tienda');

// Este endpoint guarda un nuevo carrito de compras en la base de datos
router.post('/', async (req, res) => {
    console.log('Paso 1: Iniciando el proceso de guardado del carrito...');
    try {
        // Obtenemos los datos del carrito de la solicitud
        const { carrito } = req.body;
        console.log('Paso 2: Datos del carrito obtenidos con éxito.');

        // Insertamos cada artículo en la base de datos
        const query = `
            INSERT INTO carritoCompra (CodigoCarritoCompra, IdProducto, PrecioUnitario, Cantidad, EstadoPago, DetalleTransaccion) 
            VALUES ($1, $2, $3, $4, $5, $6)`;
        
        console.log('Paso 3: Iniciando la inserción de artículos en la base de datos...');
        for (let item of carrito) {
            // Al iniciar, marcamos el EstadoPago como no pagado y sin detalles de transacción
            console.log(`Paso 4: Insertando artículo con IdProducto ${item.IdProducto}...`);
            await pool_tienda.query(query, [item.CodigoCarrito, item.IdProducto, item.PrecioUnitario, item.Cantidad, false, '']);
            console.log(`Paso 5: Artículo con IdProducto ${item.IdProducto} insertado con éxito.`);
        }
        console.log('Paso 6: Todos los artículos se insertaron con éxito.');

        // Respondemos con un mensaje de éxito
        res.status(200).json({ mensaje: 'Carrito de compras guardado con éxito.' });
        console.log('Paso 7: Respuesta enviada al cliente con éxito.');

    } catch (error) {
        // Si algo sale mal, enviamos un mensaje de error
        console.log('Paso fallido: Error al guardar el carrito de compras:', error);
        res.status(500).json({ mensaje: 'Error al guardar el carrito de compras.' });
    }
});

module.exports = router;