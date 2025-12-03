const { pool } = require('./connection');

//log a new request
const logRequest = async (method, endpoint, statusCode, ipAddress) => {
    await pool.query(
        'INSERT INTO request_logs (method, endpoint, status_code, ip_address) VALUES (?, ?, ?, ?)',
        [method, endpoint, statusCode, ipAddress]
    );
};

//get all logged requests
const getAllRequestLogs = async () => {
    const [rows] = await pool.query(
        'SELECT * FROM request_logs ORDER BY timestamp DESC'
    );
    return rows;
};

module.exports = { logRequest, getAllRequestLogs };