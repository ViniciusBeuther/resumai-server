// Import the database connection pool
const pool = require('../../config/db');
const bcrypt = require('bcrypt');

class User {
    /**
     * Used to create an user in the database
     * @param { username, email, password } : parameters to create a user 
     * @returns string username created
     */
    static async create({ username, email, password }) {
        console.log('Creating user:', { username, email });
        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        try {
            const query = `
        INSERT INTO users (username, email, password)
        VALUES (?, ?, ?);
      `;
            const values = [username, email, hashedPassword];
            const result = await pool.query(query, values);
            return result;

        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

}

module.exports = User;