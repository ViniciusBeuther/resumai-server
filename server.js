const pool = require('./src/config/db');

// import libs
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// load env vars
dotenv.config();

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5174",
  credentials: true
}

// init app
const app = express();
app.use( express.json() )
app.use( cors( corsOptions ) );
app.use( cookieParser() );

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
// Validate required environment variables
console.log('='.repeat(60));
console.log('🔐 JWT CONFIGURATION CHECK');
console.log('='.repeat(60));
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('REFRESH_TOKEN_SECRET exists:', !!process.env.REFRESH_TOKEN_SECRET);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL || 'http://localhost:5174');
console.log('='.repeat(60));

if (!process.env.JWT_SECRET) {
  console.error('❌ CRITICAL ERROR: JWT_SECRET environment variable is not set!');
  process.exit(1);
}

if (!process.env.REFRESH_TOKEN_SECRET) {
  console.error('❌ CRITICAL ERROR: REFRESH_TOKEN_SECRET environment variable is not set!');
  process.exit(1);
}
