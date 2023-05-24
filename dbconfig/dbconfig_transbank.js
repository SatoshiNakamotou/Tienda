// Importamos el módulo de pg (PostgreSQL) para Node.js
const { Pool } = require('pg');

// Configuramos los datos de conexión a la base de datos
const pool = new Pool({
  user: 'postgres',  // Tu nombre de usuario para la base de datos
  host: 'localhost',   // Dónde está alojada la base de datos. En este caso, está en la misma máquina
  database: 'RegistroTarjetas',  // Nombre de la base de datos
  password: '2526', // Tu contraseña para la base de datos
  port: 5433,          // Puerto en el que se ejecuta PostgreSQL
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
};