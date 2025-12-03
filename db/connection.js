
//import required packages
const mysql = require('mysql2/promise');
require('dotenv').config();

//create a connection pool (more efficient than signle connections)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_User,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnection: true,
    connectionLimit: 10,
    queueLimit: 0
});

const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Database connected!');
        connection.release(); //return to connection pool
        return true;
    } catch (error) {
        console.error('Connection failed:', error.message);
        return false;
    }
};

//export for use in other files
module.exports = { pool, testConnection };