// profile-service/src/utils/swagger.ts
import swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Profile Service API',
            version: '1.0.0',
            description: 'Gaming profile management microservice for PlayGamesTogether platform',
        },
        servers: [
            {
                url: 'http://localhost:3002',
                description: 'Development server',
            },
            {
                url: 'http://profile-service:3002',
                description: 'Docker server',
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'Token'
                }
            },
            schemas: {
                Profile: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
                        userId: { type: 'string', example: '507f1f77bcf86cd799439001' },
                        username: { type: 'string', example: 'gamer123' },
                        email: { type: 'string', example: 'gamer@example.com' },
                        games: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['CS:GO', 'Valorant']
                        },
                        genres: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['FPS', 'Shooter']
                        },
                        playtimes: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['Evening', 'Night']
                        },
                        languages: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['English', 'Russian']
                        },
                        skillLevel: {
                            type: 'string',
                            enum: ['beginner', 'intermediate', 'advanced', 'expert'],
                            example: 'intermediate'
                        },
                        availability: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['evenings', 'weekends']
                        },
                        bio: { type: 'string', example: 'Looking for casual team play' },
                        isOnline: { type: 'boolean', example: false },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                ProfileDto: {
                    type: 'object',
                    required: ['username', 'email'],
                    properties: {
                        username: { type: 'string', minLength: 3, maxLength: 30, example: 'gamer123' },
                        email: { type: 'string', format: 'email', example: 'gamer@example.com' },
                        games: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['CS:GO', 'Valorant']
                        },
                        genres: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['FPS', 'Shooter']
                        },
                        playtimes: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['Evening', 'Night']
                        },
                        languages: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['English', 'Russian']
                        },
                        skillLevel: {
                            type: 'string',
                            enum: ['beginner', 'intermediate', 'advanced', 'expert'],
                            example: 'intermediate'
                        },
                        availability: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['evenings', 'weekends']
                        },
                        bio: { type: 'string', maxLength: 500, example: 'Looking for casual team play' },
                        isOnline: { type: 'boolean', example: false }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'error' },
                        message: { type: 'string', example: 'Error description' }
                    }
                }
            }
        },
        tags: [
            {
                name: 'Profiles',
                description: 'Profile management endpoints'
            },
            {
                name: 'Health',
                description: 'Service health check'
            }
        ]
    },
    apis: ['src/server.ts']
};

export const swaggerSpec = swaggerJSDoc(options);