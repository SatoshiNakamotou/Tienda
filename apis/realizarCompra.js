// Importamos el módulo de express, router y axios
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Importamos las APIs que vamos a usar
// No necesitamos importar los otros archivos aquí porque vamos a usar axios para hacer las solicitudes HTTP.
// const guardarCarrito = require('./guardarCarrito');
// const validarTarjeta = require('./validarTarjeta');
// const actualizarEstadoCompra = require('./actualizarEstadoCompra');

// El punto de entrada para realizar una compra
router.post('/', async (req, res) => {
    try {
        // Obtenemos los datos del carrito y la tarjeta del cuerpo de la solicitud
        const { carrito, tarjeta } = req.body;

        // Guardamos el carrito en la base de datos
        console.log('Paso 2: Guardando carrito en la base de datos...');
        const resultadoCarrito = await axios.post('http://localhost:3000/guardarCarrito', { carrito });

        // Si hubo un error al guardar el carrito, terminamos la ejecución
        if (!resultadoCarrito.data.ok) {
            console.log('Paso 3: Error al guardar el carrito:', resultadoCarrito.error);
            return axios.put(`http://localhost:3000/actualizarEstadoCompra/${carrito.CodigoCarritoCompra}`, {
                estado: 'Error',
                detalleTransaccion: 'Error al guardar el carrito'
            });
        }

        // Validamos los datos de la tarjeta
        console.log('Paso 4: Validando tarjeta...');
        const resultadoTarjeta = await axios.post('http://localhost:3000/validarTarjeta', { tarjeta });

        // Si la tarjeta no es válida o no tiene suficientes fondos, terminamos la ejecución
        if (!resultadoTarjeta.data.ok || resultadoTarjeta.data.saldo < resultadoCarrito.data.total) {
            console.log('Paso 5: Error en la validación de la tarjeta o saldo insuficiente');
            return axios.put(`http://localhost:3000/actualizarEstadoCompra/${carrito.CodigoCarritoCompra}`, {
                estado: 'Error',
                detalleTransaccion: 'Error en la validación de la tarjeta o saldo insuficiente'
            });
        }

        // Si llegamos a este punto, la compra fue exitosa
        // Actualizamos el estado de la compra
        console.log('Paso 6: Compra realizada con éxito');
        await axios.put(`http://localhost:3000/actualizarEstadoCompra/${carrito.CodigoCarritoCompra}`, {
            estado: 'Exitoso',
            detalleTransaccion: 'Compra realizada con éxito'
        });

        // Respondemos con un mensaje de éxito
        res.status(200).json({ mensaje: 'Paso 7: Compra realizada con éxito.' });

    } catch (error) {
        // Manejar cualquier error que pueda surgir
        console.log('Paso fallido: Error interno del servidor:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
});

module.exports = router;