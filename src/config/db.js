const mysql = require('mysql2/promise');
require('dotenv').config();

console.log('='.repeat(60));
console.log('🔧 INICIANDO CONFIGURAÇÃO DO BANCO');
console.log('='.repeat(60));
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD existe?:', !!process.env.DB_PASSWORD);
console.log('DB_DATABASE:', process.env.DB_DATABASE);
console.log('='.repeat(60));

// Configuração IDÊNTICA ao Teste 2 que funcionou
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: {
    rejectUnauthorized: false
  },
  connectTimeout: 30000
});

// NÃO faça teste aqui ainda
console.log('✅ Pool criado, aguardando primeira query...');

module.exports = pool;