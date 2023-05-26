// Importamos el módulo de express y router
const express = require('express');
const router = express.Router();

// Importamos el archivo de configuración de la base de datos
const pool = require('../dbconfig/dbconfig_transbank');

// Este endpoint valida una tarjeta y comprueba si tiene suficiente saldo
router.post('/', async (req, res) => {
    try {
        console.log("Validacion tarjeta : Ingresando a validacion tarjeta======================================================================================");
        // Obtenemos los datos de la tarjeta de la solicitud
        const { tarjeta, monto } = req.body;

        console.log('Validando tarjeta...');
        console.log('Tarjeta:', tarjeta);
        console.log('Monto:', monto);

        // Convertimos la cadena JSON de tarjeta a un objeto JavaScript
        const tarjetaObjeto = JSON.parse(tarjeta);

        // Buscamos la tarjeta en la base de datos
        const queryTarjeta = `
            SELECT saldo 
            FROM tarjetas 
            WHERE numerotarjeta = $1 
              AND clavetresdigitos = $2 
              AND fechaexpiracion = $3 
              AND nombrecliente = $4`;
        const resultadoTarjeta = await pool.query(queryTarjeta, [tarjetaObjeto.numeroTarjeta, tarjetaObjeto.codigoSeguridad, tarjetaObjeto.fechaVencimiento, tarjetaObjeto.nombreTarjetaHabiente]);

        console.log('Resultado de la consulta de tarjeta:', resultadoTarjeta.rows);

        // Si la tarjeta no se encuentra
        if (resultadoTarjeta.rows.length === 0) {
            console.log('Datos de tarjeta incorrectos');
            res.status(400).json({ mensaje: 'Datos de tarjeta incorrectos.' });
        } else {
            const saldo = resultadoTarjeta.rows[0].saldo;
            // Si la tarjeta tiene saldo insuficiente
            if (saldo < monto) {
                console.log('Saldo insuficiente en la tarjeta');
                res.status(400).json({ mensaje: 'Saldo insuficiente en la tarjeta.' });
            } else {
                // Si la tarjeta es válida y tiene suficiente saldo, descontamos el monto de la compra
                const queryUpdate = `
                    UPDATE tarjetas 
                    SET saldo = saldo - $1 
                    WHERE numerotarjeta = $2`;
                await pool.query(queryUpdate, [monto, tarjetaObjeto.numeroTarjeta]);

                console.log('Saldo actualizado en la base de datos');

                // Respondemos con un mensaje de éxito
                console.log('Tarjeta validada y saldo descontado con éxito');
                res.status(200).json({ mensaje: 'Tarjeta validada y saldo descontado con éxito.' });
            }
        }
    } catch (error) {
        // Si algo sale mal, enviamos un mensaje de error
        console.log('Error al validar la tarjeta:', error);
        res.status(500).json({ mensaje: 'Error al validar la tarjeta.' });
    }
});

module.exports = router;