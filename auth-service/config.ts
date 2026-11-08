// auth-service/config.ts
export const Config = {
    port: process.env.PORT || 3001,
    mongo: {
        url: process.env.MONGO_URL || 'mongodb://localhost:27017',
        dbName: process.env.MONGO_DB_NAME || 'auth_service'
    }
}