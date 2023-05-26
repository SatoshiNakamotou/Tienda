// Importamos el módulo de express, router y axios
const express = require('express');
const router = express.Router();
const axios = require('axios');

// El punto de entrada para realizar una compra
router.post('/', async (req, res) => {
    try {
        // Obtenemos los datos del carrito y la tarjeta del cuerpo de la solicitud
        const { carrito, tarjeta } = req.body;

        // Convertimos los datos del carrito y la tarjeta a JSON
        const carritoJson = JSON.stringify(carrito);
        const tarjetaJson = JSON.stringify(tarjeta);

        // Guardamos el carrito en la base de datos
        console.log('RealizarCompra Paso 2: Guardando carrito en la base de datos...');
        console.log(carritoJson);
        const resultadoCarrito = await axios.post('http://localhost:3000/guardar-carrito', { carrito: carritoJson });
        console.log('RealizarCompra Paso 3: const guardada');

        // Si hubo un error al guardar el carrito, terminamos la ejecución
        if (!resultadoCarrito.data.ok) {
            console.log(resultadoCarrito.data.ok);
            console.log('RealizarCompra Paso: Error al guardar el carrito:', resultadoCarrito.error);
            const data = {
                estado: 'Error',
                detalleTransaccion: 'Error al guardar el carrito'
            };
            await axios.put(`http://localhost:3000/actualizarEstadoCompra/${carrito.CodigoCarritoCompra}`, data);
            return res.status(500).json({ ok: false, mensaje: 'Error al guardar el carrito.' });
        }
        console.log('llegamos aquiiiiiiiiiiiii');
        // Validamos los datos de la tarjeta
        console.log('RealizarCompra Paso 4: Validando tarjeta...');
        console.log('====================================================================================='); 
        console.log('tipo carrito'); 
        console.log(typeof carrito);
        console.log('========================================================================================='); 
        console.log(tarjetaJson);
        console.log('=========================='); 
        const resultadoTarjeta = await axios.post('http://localhost:3000/validarTarjeta', { tarjeta: tarjetaJson , monto: 200});
        console.log('despues'); 
        console.log(resultadoTarjeta);

        // Si la tarjeta no es válida o no tiene suficientes fondos, terminamos la ejecución
        if (!resultadoTarjeta.data.ok || resultadoTarjeta.data.saldo < resultadoCarrito.data.total) {
            console.log('RealizarCompra Paso 5: Error en la validación de la tarjeta o saldo insuficiente');
            const data = {
                estado: 'Error',
                detalleTransaccion: 'Error en la validación de la tarjeta o saldo insuficiente'
            };
            await axios.put(`http://localhost:3000/actualizarEstadoCompra/${carrito.CodigoCarritoCompra}`, data);
            return res.status(500).json({ ok: false, mensaje: 'Error en la validación de la tarjeta o saldo insuficiente.' });
        }

        // Si llegamos a este punto, la compra fue exitosa
        // Actualizamos el estado de la compra
        console.log('RealizarCompra Paso 6: Compra realizada con éxito');
        const data = {
            estado: 'Exitoso',
            detalleTransaccion: 'Compra realizada con éxito'
        };
        await axios.put(`http://localhost:3000/actualizarEstadoCompra/${carrito.CodigoCarritoCompra}`, data);

        // Respondemos con un mensaje de éxito
        res.status(200).json({ ok: true, mensaje: 'Paso 7: Compra realizada con éxito.' });

    } catch (error) {
        // Manejar cualquier error que pueda surgir
        console.log('RealizarCompra Paso fallido: Error interno del servidor:', error);
        res.status(500).json({ ok: false, mensaje: 'Error interno del servidor.' });
    }
});

module.exports = router;