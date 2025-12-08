const express = require('express');
require('dotenv').config();

//importing the db functions
const { testConnection } = require('../db/connection');
const requestLogQueries = require('../db/requestLogQueries');

//importing swagger
const { swaggerUi, specs } = require('./swagger');

const worldRoutes = require('../routes/worldRoutes');
const characterRoutes = require('../routes/characterRoutes');
const storyRoutes = require('../routes/storyRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

//middleware to parse JSON request bodies
app.use(express.json());

app.use(async (req, res, next) => {
    const originalJson = res.json.bind(res);
    res.json = function(data) {
        const statusCode = res.statusCode;
        const ipAddress = req.ip || req.socket.remoteAddress;
        requestLogQueries.logRequest(
            req.method,
            req.path,
            statusCode,
            ipAddress
        ).catch(err => console.error('Failed to log request:', err));
        return originalJson(data);
    };
    next();
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

//swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar {display: none}', 
    customSiteTitle: 'VtM GM API Documentation'
}));

app.get('/health', async (req, res) => {
    const dbConnected = await testConnection();
    res.json({
        status: 'ok',
        database: dbConnected ? 'connected' : 'disconnected'
    });
});

app.use('/api/world', worldRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/stories', storyRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'Vampire: The Masquerade GM API',
        version: '1.0.0'
    });
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

const startServer = async () => {
    await testConnection();
    app.listen(PORT, () => {
        console.log(`VtM GM API running on port ${PORT}`);
    });
};

startServer();

module.exports = app;