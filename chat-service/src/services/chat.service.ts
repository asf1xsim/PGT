// chat-service/src/services/chat.service.ts
import { ObjectId } from 'mongodb';
import mongo from '../database/mongo';
import { Server as SocketIOServer } from 'socket.io';

interface Message {
    matchId: string;
    senderId: string;
    content: string;
    timestamp: Date;
}

export const chatService = {
    io: null as SocketIOServer | null,

    get messages_collection() {
        if (!mongo.db) {
            throw new Error('Database not initialized');
        }
        return mongo.db.collection('messages');
    },

    setSocketIO(io: SocketIOServer) {
        this.io = io;
    },

    async getMessageHistory(matchId: string, limit: number = 50) {
        return this.messages_collection
            .find({ matchId })
            .sort({ timestamp: -1 })
            .limit(limit)
            .toArray();
    },

    async saveMessage(message: Message) {
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

    async deleteMessage(id: string) {
        return this.messages_collection.deleteOne({
            _id: new ObjectId(id)
        });
    },

    async getConversations(userId: string) {
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