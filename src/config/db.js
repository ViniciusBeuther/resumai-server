const fs = require( "fs" );
// config/db.js
const mysql = require('mysql2/promise'); 
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: {
    ca: fs.readFileSync("/etc/secrets/ca.pem")
  },
  waitForConnections: true,
  connectionLimit: 10, 
  queueLimit: 0
});

pool.getConnection()
  .then(connection => {
    console.log('🔌 Conectado ao banco de dados MySQL com sucesso!');
    connection.release(); 
  })
  .catch(err => {
    console.error('❌ Erro ao conectar com o banco de dados:', err);
  });

module.exports = pool;