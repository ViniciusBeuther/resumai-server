// import libs
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// load env vars
dotenv.config();

// init app
const app = express();
app.use( express.json() )
app.use( cors() );

const authMiddleware = require( './src/api/middlewares/authMiddleware' );

// routes
const userRoutes = require( './src/api/routes/user.routes' );
const authRoutes = require( './src/api/routes/auth.routes' );
const chatRoutes = require( './src/api/routes/chat.routes' );

app.use( '/api/auth', authRoutes );
app.use( '/api/users', authMiddleware, userRoutes );
app.use( '/api/chat', authMiddleware, chatRoutes );

// define port and start server
const PORT = process.env.PORT || 3000;
app.listen( PORT, () => console.log(`Server running on port ${PORT}`) );


app.get('/', (req, res) => {
  res.send('Hello World!');
});


// Adicione isso ANTES do app.listen
app.get('/test-db', async (req, res) => {
  console.log('\n🧪 INICIANDO TESTE DE CONEXÃO VIA ENDPOINT');
  
  try {
    console.log('⏳ Criando conexão...');
    const connection = await pool.getConnection();
    console.log('✅ Conexão obtida!');
    
    console.log('⏳ Executando query...');
    const [rows] = await connection.query('SELECT 1 + 1 AS result');
    console.log('✅ Query executada:', rows);
    
    connection.release();
    console.log('✅ Conexão liberada!');
    
    res.json({ 
      success: true, 
      message: 'Conexão com banco OK!',
      result: rows 
    });
  } catch (error) {
    console.error('❌ ERRO NO TESTE:');
    console.error('Code:', error.code);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    
    res.status(500).json({ 
      success: false, 
      error: error.message,
      code: error.code 
    });
  }
});