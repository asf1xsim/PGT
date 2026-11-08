"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
class MongoDB {
    constructor() {
        this.client = null;
        this.db = null;
    }
    async connect() {
        try {
            const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27018';
            const dbName = process.env.MONGO_DB_NAME || 'chat_service';
            this.client = new mongodb_1.MongoClient(mongoUrl);
            await this.client.connect();
            this.db = this.client.db(dbName);
            console.log(`✅ Connected to MongoDB: ${dbName}`);
        }
        catch (error) {
            console.error('❌ MongoDB connection error:', error);
            throw error;
        }
    }
    async disconnect() {
        if (this.client) {
            await this.client.close();
            console.log('✅ Disconnected from MongoDB');
        }
    }
}
const mongo = new MongoDB();
exports.default = mongo;
