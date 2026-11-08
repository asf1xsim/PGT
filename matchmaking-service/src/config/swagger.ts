// matchmaking-service/src/config/swagger.ts
import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Matchmaking Service API',
            version: '1.0.0',
            description: 'Game matchmaking microservice for PlayGamesTogether platform'
        },
        servers: [
            {
                url: 'http://localhost:3004',
                description: 'Development server'
            },
            {
                url: 'http://matchmaking-service:3004',
                description: 'Docker server'
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
                // Match Schema
                Match: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Match ID (MongoDB ObjectId)',
                            example: '507f1f77bcf86cd799439011'
                        },
                        requesterProfileId: {
                            type: 'string',
                            description: 'Requester profile ID',
                            example: '507f1f77bcf86cd799439001'
                        },
                        targetProfileId: {
                            type: 'string',
                            description: 'Target profile ID',
                            example: '507f1f77bcf86cd799439002'
                        },
                        game: {
                            type: 'string',
                            description: 'Game name',
                            example: 'Counter-Strike 2'
                        },
                        message: {
                            type: 'string',
                            description: 'Optional message from requester',
                            example: 'Hey! Want to play together?'
                        },
                        status: {
                            type: 'string',
                            enum: ['pending', 'accepted', 'declined'],
                            description: 'Match status',
                            example: 'pending'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Match creation timestamp'
                        },
                        acceptedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Match acceptance timestamp'
                        },
                        declinedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Match decline timestamp'
                        }
                    }
                },
                // Error Schema
                Error: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            description: 'Error status code',
                            example: 'bad input'
                        },
                        message: {
                            type: 'string',
                            description: 'Error message',
                            example: 'Invalid match ID'
                        },
                        statusCode: {
                            type: 'integer',
                            description: 'HTTP status code',
                            example: 400
                        }
                    }
                },
                // MatchRequestDto Schema
                MatchRequestDto: {
                    type: 'object',
                    required: ['requesterProfileId', 'targetProfileId', 'game'],
                    properties: {
                        requesterProfileId: {
                            type: 'string',
                            minLength: 24,
                            maxLength: 24,
                            description: 'Requester profile ID (MongoDB ObjectId)',
                            example: '507f1f77bcf86cd799439001'
                        },
                        targetProfileId: {
                            type: 'string',
                            minLength: 24,
                            maxLength: 24,
                            description: 'Target profile ID (MongoDB ObjectId)',
                            example: '507f1f77bcf86cd799439002'
                        },
                        game: {
                            type: 'string',
                            minLength: 2,
                            maxLength: 100,
                            description: 'Game name',
                            example: 'Counter-Strike 2'
                        },
                        message: {
                            type: 'string',
                            maxLength: 300,
                            description: 'Optional message',
                            example: 'Looking for teammates for competitive mode'
                        }
                    }
                }
            }
        },
        tags: [
            {
                name: 'Matchmaking',
                description: 'Match request and matchmaking operations'
            },
            {
                name: 'Health',
                description: 'Service health check'
            }
        ]
    },
    apis: [
        './src/api/controllers/*.ts',
        './src/app.ts'
    ]
};

export const swaggerSpec = swaggerJSDoc(options);