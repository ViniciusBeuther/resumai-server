const mysql = require('mysql2/promise');
require('dotenv').config();

console.log('🔧 Inicializando configuração do banco...');
console.log('Host:', process.env.DB_HOST);
console.log('Port:', process.env.PORT);
console.log('User:', process.env.DB_USER);
console.log('Database:', process.env.DB_DATABASE);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: {
    rejectUnauthorized: false
  },
  connectTimeout: 60000, // 60 segundos
  waitForConnections: true,
  connectionLimit: 5, // Reduzi para 5
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Teste imediato
(async () => {
  try {
    console.log('⏳ Tentando conectar ao banco...');
    const connection = await pool.getConnection();
    console.log('✅ Conectado ao banco de dados MySQL com sucesso!');
    connection.release();
  } catch (err) {
    console.error('❌ ERRO ao conectar com o banco de dados:');
    console.error('Code:', err.code);
    console.error('Message:', err.message);
    console.error('Stack:', err.stack);
  }
})();

module.exports = pool;