const mysql = require('mysql2');
require('dotenv').config(); // Para leer las variables de .env

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'ti-usr3-cp.cuc-carrera-ti.ac.cr',
  user: process.env.DB_USER || 'tiusr3cp_admin',
  password: process.env.DB_PASS || 'Hairwax1@',
  database: process.env.DB_NAME || 'tiusr3cp_sistema',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
