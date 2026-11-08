// api-gateway/src/swagger/swagger.config.ts
import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'PlayGamesTogether API Gateway',
            version: '1.0.0',
            description: 'Central API Gateway for all PlayGamesTogether microservices - Gaming matchmaking platform with real-time chat',
            contact: {
                name: 'API Support',
                email: 'support@playgamestogether.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development API Gateway',
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token in the format: Bearer {token}'
                }
            },
            schemas: {
                // ==================== COMMON SCHEMAS ====================
                Error: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'error',
                            description: 'Error status type'
                        },
                        message: {
                            type: 'string',
                            example: 'Something went wrong',
                            description: 'Detailed error message'
                        }
                    }
                },

                SuccessResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true
                        },
                        message: {
                            type: 'string',
                            example: 'Operation completed successfully'
                        }
                    }
                },

                HealthCheck: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'ok'
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time'
                        },
                        service: {
                            type: 'string',
                            example: 'api-gateway'
                        },
                        version: {
                            type: 'string',
                            example: '1.0.0'
                        }
                    }
                },

                // ==================== AUTH SCHEMAS ====================
                RegisterDto: {
                    type: 'object',
                    required: ['username', 'email', 'password'],
                    properties: {
                        username: {
                            type: 'string',
                            minLength: 3,
                            maxLength: 30,
                            example: 'gamer123'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'gamer@example.com'
                        },
                        password: {
                            type: 'string',
                            minLength: 6,
                            example: 'password123'
                        }
                    }
                },

                LoginDto: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'gamer@example.com'
                        },
                        password: {
                            type: 'string',
                            example: 'password123'
                        }
                    }
                },

                AuthResponse: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439011'
                        },
                        username: {
                            type: 'string',
                            example: 'gamer123'
                        },
                        email: {
                            type: 'string',
                            example: 'gamer@example.com'
                        },
                        token: {
                            type: 'string',
                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                        }
                    }
                },

                User: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439011'
                        },
                        username: {
                            type: 'string',
                            example: 'gamer123'
                        },
                        email: {
                            type: 'string',
                            example: 'gamer@example.com'
                        }
                    }
                },

                UpdateUserDto: {
                    type: 'object',
                    properties: {
                        username: {
                            type: 'string',
                            example: 'newusername'
                        },
                        email: {
                            type: 'string',
                            example: 'newemail@example.com'
                        },
                        password: {
                            type: 'string',
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
                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
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
                            example: 'gamer123'
                        },
                        email: {
                            type: 'string',
                            example: 'gamer@example.com'
                        }
                    }
                },

                // ==================== PROFILE SCHEMAS ====================
                ProfileDto: {
                    type: 'object',
                    required: ['username', 'email'],
                    properties: {
                        username: {
                            type: 'string',
                            minLength: 3,
                            maxLength: 30,
                            example: 'gamer123'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'gamer@example.com'
                        },
                        games: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['CS:GO', 'Valorant']
                        },
                        genres: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['FPS', 'Shooter']
                        }
                    }
                },

                Profile: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439011'
                        },
                        username: {
                            type: 'string',
                            example: 'gamer123'
                        },
                        email: {
                            type: 'string',
                            example: 'gamer@example.com'
                        },
                        games: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['CS:GO', 'Valorant']
                        },
                        isOnline: {
                            type: 'boolean',
                            example: false
                        }
                    }
                },

                OnlineStatusDto: {
                    type: 'object',
                    required: ['isOnline'],
                    properties: {
                        isOnline: {
                            type: 'boolean',
                            example: true
                        }
                    }
                },

                // ==================== CHAT SCHEMAS ====================
                Message: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439011'
                        },
                        matchId: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439021'
                        },
                        senderId: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439001'
                        },
                        content: {
                            type: 'string',
                            example: 'Hey! Want to play CS:GO?'
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },

                SendMessageDto: {
                    type: 'object',
                    required: ['matchId', 'senderId', 'content'],
                    properties: {
                        matchId: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439021'
                        },
                        senderId: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439001'
                        },
                        content: {
                            type: 'string',
                            maxLength: 1000,
                            example: 'Hey! Want to play?'
                        }
                    }
                },

                // ==================== MATCHMAKING SCHEMAS ====================
                Match: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439021'
                        },
                        requesterProfileId: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439011'
                        },
                        targetProfileId: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439012'
                        },
                        game: {
                            type: 'string',
                            example: 'Counter-Strike 2'
                        },
                        status: {
                            type: 'string',
                            enum: ['pending', 'accepted', 'declined'],
                            example: 'pending'
                        }
                    }
                },

                MatchRequestDto: {
                    type: 'object',
                    required: ['requesterProfileId', 'targetProfileId', 'game'],
                    properties: {
                        requesterProfileId: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439011'
                        },
                        targetProfileId: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439012'
                        },
                        game: {
                            type: 'string',
                            example: 'Counter-Strike 2'
                        },
                        message: {
                            type: 'string',
                            maxLength: 300,
                            example: 'Want to play ranked?'
                        }
                    }
                },

                // ==================== NOTIFICATION SCHEMAS ====================
                Notification: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439031'
                        },
                        userId: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439001'
                        },
                        type: {
                            type: 'string',
                            enum: ['match_request', 'match_accepted', 'match_declined', 'new_message'],
                            example: 'match_request'
                        },
                        title: {
                            type: 'string',
                            example: 'New Match Request'
                        },
                        message: {
                            type: 'string',
                            example: 'Player123 wants to play!'
                        },
                        read: {
                            type: 'boolean',
                            example: false
                        }
                    }
                },

                NotificationDto: {
                    type: 'object',
                    required: ['userId', 'type', 'title', 'message'],
                    properties: {
                        userId: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439001'
                        },
                        type: {
                            type: 'string',
                            enum: ['match_request', 'match_accepted', 'match_declined', 'new_message'],
                            example: 'match_request'
                        },
                        title: {
                            type: 'string',
                            example: 'New Match Request'
                        },
                        message: {
                            type: 'string',
                            example: 'Player123 wants to play with you!'
                        }
                    }
                },

                TelegramLinkDto: {
                    type: 'object',
                    required: ['userId', 'chatId'],
                    properties: {
                        userId: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439001'
                        },
                        chatId: {
                            type: 'string',
                            example: '123456789'
                        }
                    }
                },

                TelegramLinkResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true
                        },
                        userId: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439001'
                        },
                        chatId: {
                            type: 'string',
                            example: '123456789'
                        }
                    }
                }
            }
        },
        tags: [
            {
                name: 'Health',
                description: 'Service health check'
            },
            {
                name: 'Auth',
                description: 'Authentication and user management'
            },
            {
                name: 'Profiles',
                description: 'Gaming profile management'
            },
            {
                name: 'Chat',
                description: 'Real-time chat functionality'
            },
            {
                name: 'Matchmaking',
                description: 'Match creation and management'
            },
            {
                name: 'Notifications',
                description: 'Notification system'
            }
        ]
    },
    apis: [
        './src/server.ts',
        './src/routes/*.ts'
    ]
};

export const swaggerSpec = swaggerJSDoc(options);