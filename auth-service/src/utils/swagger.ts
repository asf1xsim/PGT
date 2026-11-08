// auth-service/src/utils/swagger.ts
import swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Auth Service API',
            version: '1.0.0',
            description: 'Authentication and user management microservice for PlayGamesTogether platform',
            contact: {
                name: 'API Support',
                email: 'support@playgamestogether.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3001',
                description: 'Development server',
            },
            {
                url: 'http://auth-service:3001',
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
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'User ID (MongoDB ObjectId)',
                            example: '507f1f77bcf86cd799439011'
                        },
                        username: {
                            type: 'string',
                            minLength: 3,
                            maxLength: 30,
                            example: 'johndoe'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'john@example.com'
                        },
                        token: {
                            type: 'string',
                            description: 'Authentication token',
                            example: 'a1b2c3d4e5f6...'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                RegisterRequest: {
                    type: 'object',
                    required: ['username', 'email', 'password'],
                    properties: {
                        username: {
                            type: 'string',
                            minLength: 3,
                            maxLength: 30,
                            example: 'johndoe'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'john@example.com'
                        },
                        password: {
                            type: 'string',
                            minLength: 6,
                            example: 'password123'
                        }
                    }
                },
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'john@example.com'
                        },
                        password: {
                            type: 'string',
                            example: 'password123'
                        }
                    }
                },
                UpdateUserRequest: {
                    type: 'object',
                    properties: {
                        username: {
                            type: 'string',
                            minLength: 3,
                            maxLength: 30,
                            example: 'johndoe_updated'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'john_new@example.com'
                        },
                        password: {
                            type: 'string',
                            minLength: 6,
                            example: 'newpassword123'
                        }
                    }
                },
                VerifyTokenRequest: {
                    type: 'object',
                    required: ['token'],
                    properties: {
                        token: {
                            type: 'string',
                            example: 'a1b2c3d4e5f6...'
                        }
                    }
                },
                VerifyTokenResponse: {
                    type: 'object',
                    properties: {
                        valid: {
                            type: 'boolean',
                            example: true
                        },
                        userId: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439011'
                        },
                        username: {
                            type: 'string',
                            example: 'johndoe'
                        },
                        email: {
                            type: 'string',
                            example: 'john@example.com'
                        }
                    }
                },
                HealthResponse: {
                    type: 'object',
                    properties: {
                        service: {
                            type: 'string',
                            example: 'auth-service'
                        },
                        status: {
                            type: 'string',
                            example: 'healthy'
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'error'
                        },
                        message: {
                            type: 'string',
                            example: 'Error description'
                        }
                    }
                }
            }
        },
        tags: [
            {
                name: 'Authentication',
                description: 'User authentication endpoints'
            },
            {
                name: 'Users',
                description: 'User management endpoints'
            },
            {
                name: 'Health',
                description: 'Service health check'
            }
        ]
    },
    apis: [
        'src/api/controllers/*.ts',
        'src/api/server.ts'
    ]
};

export const swaggerSpec = swaggerJSDoc(options);