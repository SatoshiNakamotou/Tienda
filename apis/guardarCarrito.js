// Importamos el módulo de express y router
const express = require('express');
const router = express.Router();

// Importamos el archivo de configuración de la base de datos de la tienda
const pool_tienda = require('../dbconfig/dbconfig_tienda');

// Este endpoint guarda un nuevo carrito de compras en la base de datos
router.post('/', async (req, res) => {
    console.log('guardaCarrito Paso 1: Iniciando el proceso de guardado del carrito...');
    try {
        // Obtenemos los datos del carrito de la solicitud
        const { carrito } = req.body;
        console.log("Estructura del carrito");
        console.log(carrito);

        console.log('guardaCarrito Paso 2: Datos del carrito obtenidos con éxito.');

        // Convertir el carrito de un string a un objeto JSON válido
        const carritoObjeto = JSON.parse(carrito);

        // Insertamos cada artículo en la base de datos
        const query = `
            INSERT INTO carritoCompra (CodigoCarritoCompra, IdProducto, PrecioUnitario, Cantidad, EstadoPago, DetalleTransaccion) 
            VALUES ($1, $2, $3, $4, $5, $6)`;

        console.log('guardaCarrito Paso 3: Iniciando la inserción de artículos en la base de datos...');
        console.log('ANTES DEL FOR');
        console.log('===================================================================================================');

        // Iterar sobre el objeto carritoObjeto
        for (let item of carritoObjeto) {
            console.log(`Imprimiendo item`);
            console.log(item);
            console.log(item.CodigoCarritoCompra);
            console.log(item.IdProducto);
            console.log(item.PrecioUnitario);
            console.log(item.Cantidad);

            // Insertar el artículo en la base de datos
            console.log(`Insertando artículo con IdProducto ${item.IdProducto}...`);
            await pool_tienda.query(query, [item.CodigoCarritoCompra, item.IdProducto, item.PrecioUnitario, item.Cantidad, false, '']);
            console.log(`Artículo con IdProducto ${item.IdProducto} insertado con éxito.`);
        }

        console.log(`TERMINOO PROCESO FOR`);

        console.log('guardaCarrito Paso 6: Todos los artículos se insertaron con éxito.');

        // Respondemos con un mensaje de éxito
        res.status(200).json({ ok: true, mensaje: 'Carrito de compras guardado con éxito.' });
        console.log('guardaCarrito Paso 7: Respuesta enviada al cliente con éxito.');

    } catch (error) {
        // Si algo sale mal, enviamos un mensaje de error
        console.log('ERROR----------------------------------------------');
        console.log('Paso fallido: Error al guardar el carrito de compras:', error);
        res.status(500).json({ ok: false, mensaje: 'Error al guardar el carrito de compras.' });
    }
});

module.exports = router;