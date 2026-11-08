// profile-service/config.ts
export const Config = {
    port: process.env.PORT || 3002,
    mongo: {
        url: process.env.MONGO_URL || 'mongodb://localhost:27018',
        dbName: process.env.MONGO_DB_NAME || 'profile_service'
    },
    authService: {
        url: process.env.AUTH_SERVICE_URL || 'http://localhost:3001'
    }
}