// notification-service/src/config/swagger.ts
import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Notification Service API',
            version: '1.0.0',
            description: 'Notification and Telegram integration microservice'
        },
        servers: [
            {
                url: 'http://localhost:3005',
                description: 'Development server'
            },
            {
                url: 'http://notification-service:3005',
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
                Notification: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439011'
                        },
                        userId: {
                            type: 'string',
                            description: 'User ID',
                            example: '507f1f77bcf86cd799439001'
                        },
                        type: {
                            type: 'string',
                            enum: ['match_request', 'match_accepted', 'match_declined', 'new_message'],
                            description: 'Notification type',
                            example: 'match_request'
                        },
                        title: {
                            type: 'string',
                            description: 'Notification title',
                            example: 'New match request'
                        },
                        message: {
                            type: 'string',
                            description: 'Notification message',
                            example: 'You have a new match request from Player123'
                        },
                        read: {
                            type: 'boolean',
                            description: 'Read status',
                            example: false
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Creation timestamp'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'bad input'
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
                }
            }
        },
        tags: [
            {
                name: 'Notifications',
                description: 'Notification operations'
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