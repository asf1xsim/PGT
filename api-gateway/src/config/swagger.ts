// api-gateway/src/config/swagger.ts
import swaggerJSDoc from 'swagger-jsdoc';
import { Config } from './config';

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'PlayGamesTogether API Gateway',
            version: '1.0.0',
            description: 'Central API Gateway for all PlayGamesTogether microservices',
            contact: {
                name: 'API Support'
            }
        },
        servers: [
            {
                url: `http://localhost:${Config.port}`,
                description: 'Development API Gateway'
            },
            {
                url: 'http://api-gateway:3000',
                description: 'Docker API Gateway'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'Token',
                    description: 'Enter your bearer token'
                }
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        code: {
                            type: 'string',
                            example: 'validation_error'
                        },
                        message: {
                            type: 'string',
                            example: 'Invalid input data'
                        },
                        statusCode: {
                            type: 'integer',
                            example: 400
                        }
                    }
                },
                // Auth Service Schemas
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '507f1f77bcf86cd799439011' },
                        username: { type: 'string', example: 'johndoe' },
                        email: { type: 'string', example: 'john@example.com' },
                        token: { type: 'string' }
                    }
                },
                // Profile Service Schemas
                Profile: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        userId: { type: 'string' },
                        username: { type: 'string' },
                        email: { type: 'string' },
                        games: { type: 'array', items: { type: 'string' } },
                        genres: { type: 'array', items: { type: 'string' } }
                    }
                },
                // Matchmaking Service Schemas
                Match: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        requesterProfileId: { type: 'string' },
                        targetProfileId: { type: 'string' },
                        game: { type: 'string' },
                        status: { type: 'string', enum: ['pending', 'accepted', 'declined'] }
                    }
                },
                // Chat Service Schemas
                Message: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        matchId: { type: 'string' },
                        senderId: { type: 'string' },
                        content: { type: 'string' },
                        timestamp: { type: 'string', format: 'date-time' }
                    }
                },
                // Notification Service Schemas
                Notification: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        userId: { type: 'string' },
                        type: { type: 'string' },
                        title: { type: 'string' },
                        message: { type: 'string' },
                        read: { type: 'boolean' }
                    }
                }
            }
        },
        tags: [
            {
                name: 'Health',
                description: 'Health check endpoints'
            },
            {
                name: 'Auth',
                description: 'Authentication endpoints (auth-service)'
            },
            {
                name: 'Profiles',
                description: 'Profile management endpoints (profile-service)'
            },
            {
                name: 'Chat',
                description: 'Chat and messaging endpoints (chat-service)'
            },
            {
                name: 'Matchmaking',
                description: 'Game matchmaking endpoints (matchmaking-service)'
            },
            {
                name: 'Notifications',
                description: 'Notification endpoints (notification-service)'
            }
        ]
    },
    apis: [
        './src/routes/*.ts',
        './src/app.ts'
    ]
};

export const swaggerSpec = swaggerJSDoc(options);