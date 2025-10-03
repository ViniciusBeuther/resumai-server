const User = require("../models/user.model");

exports.create = async (req, res) => {
  try{
    const { username, email, password } = req.body;
    
    // Basic validation
    if( !username || !email || !password ){
      return res.status(400).json({ message: 'Please provide username, email, and password' });
    }
    
    User.create({ username, email, password });

    return res.status(201).json({ message: 'User created successfully', user: username });
  } catch( error ){
    console.error('User.Controller.Create: Error creating user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};