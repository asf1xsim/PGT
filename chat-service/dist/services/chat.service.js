"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatService = void 0;
const mongodb_1 = require("mongodb");
const mongo_1 = __importDefault(require("../database/mongo"));
exports.chatService = {
    io: null,
    get messages_collection() {
        if (!mongo_1.default.db) {
            throw new Error('Database not initialized');
        }
        return mongo_1.default.db.collection('messages');
    },
    setSocketIO(io) {
        this.io = io;
    },
    async getMessageHistory(matchId, limit = 50) {
        return this.messages_collection
            .find({ matchId })
            .sort({ timestamp: -1 })
            .limit(limit)
            .toArray();
    },
    async saveMessage(message) {
        const result = await this.messages_collection.insertOne({
            ...message,
            createdAt: new Date()
        });
        const savedMessage = {
            _id: result.insertedId,
            ...message
        };
        // Emit to socket.io if available
        if (this.io) {
            this.io.to(`match_${message.matchId}`).emit('new_message', savedMessage);
        }
        return savedMessage;
    },
    async deleteMessage(id) {
        return this.messages_collection.deleteOne({
            _id: new mongodb_1.ObjectId(id)
        });
    },
    async getConversations(userId) {
        // Get unique match IDs where user participated
        return this.messages_collection
            .aggregate([
            {
                $match: {
                    $or: [
                        { senderId: userId }
                    ]
                }
            },
            {
                $group: {
                    _id: '$matchId',
                    lastMessage: { $last: '$$ROOT' },
                    messageCount: { $sum: 1 }
                }
            },
            {
                $sort: { 'lastMessage.timestamp': -1 }
            }
        ])
            .toArray();
    }
};
