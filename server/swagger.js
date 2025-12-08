const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Vampire: The Masquerade GM API',
            version: '1.0.0',
            description: 'A comprehensive Game Master API for Vampire: The Masquerade with character management, world information, and AI story generation',
            contact: {
                name: 'API Support'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server'
            }
        ],
        tags: [
            { name: 'World', description: 'World information endpoints (clans, disciplines, attributes, etc.)' },
            { name: 'Characters', description: 'Character management endpoints' },
            { name: 'Stories', description: 'AI story generation and session management' },
            { name: 'Health', description: 'Health check endpoints' }
        ]
    },
    apis: [
        path.join(__dirname, '../routes/*.js'),
        path.join(__dirname, './index.js')
    ]
};

const specs = swaggerJsdoc(options);

//debug: uncomment to see what paths are being scanned
//console.log('Swagger scanning paths:', options.apis);
//console.log('Swagger specs paths:', Object.keys(specs.paths || {}));

module.exports = { swaggerUi, specs };