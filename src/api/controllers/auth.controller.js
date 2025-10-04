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
    
    // get result
    const [result] = await pool.query(query, [username, hashedPassword, email]);
    
    res.status(201).json({ 
      message: 'User created successfully!',
      userId: result.insertId 
    });
    
  } catch (err) {
    console.error('Error registering user:', err);
    
    // handle duplicate
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

    // Query db
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    // check if the user exists
    if (users.length === 0) {
      return res.status(404).send('User not found');
    }

    const user = users[0];

    // compare password
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(403).send('Invalid credentials');
    }

    // create token
    const token = jwt.sign(
      { id: user.id, username: user.username }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );
    
    return res.json({ 
      message: 'Success, logged in!', 
      token, 
      user_id: user.id 
    });
    
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('An error occurred during login.');
  }
};