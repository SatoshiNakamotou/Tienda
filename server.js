// Requerimos los módulos necesarios para nuestra aplicación
const express = require('express');
const app = express();

// Estos son nuestros endpoints que se alojarán en archivos separados
// Nota: estos módulos están en el directorio 'apis'
const realizarCompra = require('./apis/realizarCompra');
const guardarCarrito = require('./apis/guardarCarrito');
const actualizarEstadoCompra = require('./apis/actualizarEstadoCompra');
const validarTarjeta = require('./apis/validarTarjeta');

// Middleware para parsear JSON en las solicitudes entrantes
app.use(express.json());

// Establecemos las rutas para nuestros endpoints
// Cada ruta se enlaza con su correspondiente controlador de API
app.use('/realizar-compra', realizarCompra);
app.use('/guardar-carrito', guardarCarrito);
app.use('/actualizar-estado-compra', actualizarEstadoCompra);
app.use('/validar-tarjeta', validarTarjeta);

// Inicio del servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});