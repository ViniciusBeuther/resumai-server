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