// matchmaking-service/src/services/matchmaking.service.ts
import { ObjectId } from 'mongodb';
import mongo from '../database/mongo';
import { MatchRequestDto } from '../types/dto/matchmaking.dto';

export const matchmakingService = {
    get matches_collection() {
        if (!mongo.db) {
            throw new Error('Database not initialized');
        }
        return mongo.db.collection('matches');
    },

    async createRequest(dto: MatchRequestDto) {
        const match = {
            requesterProfileId: new ObjectId(dto.requesterProfileId),
            targetProfileId: new ObjectId(dto.targetProfileId),
            game: dto.game,
            message: dto.message,
            status: 'pending',
            createdAt: new Date()
        };

        const result = await this.matches_collection.insertOne(match);
        return {
            ...match,
            _id: result.insertedId
        };
    },

    async getById(id: string) {
        return this.matches_collection.findOne({
            _id: new ObjectId(id)
        });
    },

    async findMatches(page: number, limit: number) {
        const skip = (page - 1) * limit;

        return this.matches_collection
            .find({ status: 'pending' })
            .skip(skip)
            .limit(limit)
            .toArray();
    },

    async acceptMatch(id: string) {
        const result = await this.matches_collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { status: 'accepted', acceptedAt: new Date() } },
            { returnDocument: 'after' }
        );

        return result;
    },

    async declineMatch(id: string) {
        const result = await this.matches_collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { status: 'declined', declinedAt: new Date() } },
            { returnDocument: 'after' }
        );

        return result;
    }
};