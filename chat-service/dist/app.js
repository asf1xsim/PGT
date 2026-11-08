"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const server_1 = require("./server");
const mongo_1 = __importDefault(require("./database/mongo"));
const config_1 = require("./config");
const port = config_1.Config.port || 3003;
async function init() {
    try {
        await mongo_1.default.connect();
        console.log('MongoDB connected successfully');
        server_1.httpServer.listen(port, () => {
            console.log(`Chat Service listening on http://localhost:${port}`);
            console.log(`WebSocket server ready on ws://localhost:${port}`);
            console.log(`API Docs available at http://localhost:${port}/api-docs`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
init();
exports.default = server_1.httpServer;
