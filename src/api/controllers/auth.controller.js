const pool = require('../../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Registers a new user.
 */
exports.register = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    if (!username || !password) {
      return res.status(400).send('Username and password are required');
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users(username, password, email) VALUES(?,?,?)';
    
    const [result] = await pool.query(query, [username, hashedPassword, email]);
    
    res.status(201).json({ 
      message: 'User created successfully!',
      userId: result.insertId 
    });
    
  } catch (err) {
    console.error('Error registering user:', err);
    
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).send('Username or email already exists');
    }
    
    res.status(500).send('Database error');
  }
};

/**
 * Logs in a user.
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).send('Email and password are required.');
    }

    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(404).send('User not found');
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(403).send('Invalid credentials');
    }

    // Create access token
    const token = jwt.sign(
      { id: user.id, username: user.username }, 
      process.env.JWT_SECRET, 
      { expiresIn: '15m' }
    );

    // Create refresh token
    const refreshToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    // Store refresh token in database (opcional mas recomendado)
    await pool.query(
      'UPDATE users SET refresh_token = ? WHERE id = ?',
      [refreshToken, user.id]
    );

    // Send refresh token as httpOnly cookie (mais seguro)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS apenas em produção
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
    });
    
    return res.json({ 
      message: 'Success, logged in!', 
      token, 
      user_id: user.id 
    });
    
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('An error occurred during login. ' + error);
  }
};

/**
 * Refreshes the access token using a valid refresh token.
 */
exports.refresh = async (req, res) => {
  try {
    // Get refresh token from cookie or body
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).send('Refresh token not provided');
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      return res.status(403).send('Invalid or expired refresh token');
    }

    const [users] = await pool.query(
      'SELECT id, username, refresh_token FROM users WHERE id = ?',
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(404).send('User not found');
    }

    const user = users[0];

    // Check if refresh token matches (se estiver armazenando no DB)
    if (user.refresh_token !== refreshToken) {
      return res.status(403).send('Invalid refresh token');
    }

    // Generate new access token
    const newToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // generate a new refresh token
    const newRefreshToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    // Update refresh token in database
    await pool.query(
      'UPDATE users SET refresh_token = ? WHERE id = ?',
      [newRefreshToken, user.id]
    );

    // Send new refresh token as cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      message: 'Token refreshed successfully',
      token: newToken
    });

  } catch (error) {
    console.error('Auth.refresh - Error refreshing:', error);
    res.status(500).send('An error occurred during refreshing.');
  }
};

/**
 * Logs out a user by invalidating the refresh token.
 */
exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (refreshToken) {
      // Verify token to get user id
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      
      // Remove refresh token from database
      await pool.query(
        'UPDATE users SET refresh_token = NULL WHERE id = ?',
        [decoded.id]
      );
    }

    // Clear cookie
    res.clearCookie('refreshToken');

    return res.json({ message: 'Logged out successfully' });

  } catch (error) {
    console.error('Auth.logout - Error:', error);
    res.status(500).send('An error occurred during logout.');
  }
};