"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.Config = {
    port: process.env.PORT || 3003,
    mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017',
    mongoDbName: process.env.MONGO_DB_NAME || 'chat_service',
};
exports.default = exports.Config;
