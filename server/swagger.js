// swagger stuff
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

// swagger config
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Vampire: The Masquerade GM API', // api name
            version: '1.0.0', // api version
            description: 'A comprehensive Game Master API for Vampire: The Masquerade with character management, world information, and AI story generation', // quick summary
            contact: {
                name: 'API Support' // contact name
            }
        },
        servers: [
            {
                url: 'http://localhost:3000', // dev server url
                description: 'Development server' // dev server desc
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
        path.join(__dirname, '../routes/*.js'), // routes
        path.join(__dirname, './index.js') // extra docs
    ]
};

const specs = swaggerJsdoc(options);

// module out
module.exports = { swaggerUi, specs };