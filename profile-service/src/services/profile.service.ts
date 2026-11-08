// profile-service/src/services/profile.service.ts
import { ObjectId } from 'mongodb';
import mongo from '../database/mongo';
import { ProfileDto } from '../types/profile.dto';
import Profile from "../database/profile.model";

export const profileService = {
    get profiles_collection() {
        if (!mongo.db) {
            throw new Error('Database not initialized');
        }
        return mongo.db.collection<Profile>('profiles');
    },

    async getAll(): Promise<Profile[]> {
        return this.profiles_collection.find({}).toArray();
    },

    async create(dto: ProfileDto): Promise<Profile> {
        const profile: Omit<Profile, '_id'> = {
            userId: new ObjectId(),
            username: dto.username,
            email: dto.email,
            games: dto.games || [],
            genres: dto.genres || [],
            playtimes: dto.playtimes || [],
            languages: dto.languages || [],
            skillLevel: dto.skillLevel,
            availability: dto.availability || [],
            bio: dto.bio,
            isOnline: false,
            createdAt: new Date()
        };

        const result = await this.profiles_collection.insertOne(profile as any);

        return {
            _id: result.insertedId,
            ...profile
        } as Profile;
    },

    async getById(id: string): Promise<Profile | null> {
        return this.profiles_collection.findOne({
            _id: new ObjectId(id)
        });
    },

    async getByUserId(userId: string): Promise<Profile | null> {
        return this.profiles_collection.findOne({
            userId: new ObjectId(userId)
        });
    },

    async update(id: string, dto: ProfileDto): Promise<Profile | null> {
        const updateData: Partial<Profile> = {
            username: dto.username,
            email: dto.email,
            updatedAt: new Date()
        };

        if (dto.games !== undefined) updateData.games = dto.games;
        if (dto.genres !== undefined) updateData.genres = dto.genres;
        if (dto.playtimes !== undefined) updateData.playtimes = dto.playtimes;
        if (dto.languages !== undefined) updateData.languages = dto.languages;
        if (dto.skillLevel !== undefined) updateData.skillLevel = dto.skillLevel;
        if (dto.availability !== undefined) updateData.availability = dto.availability;
        if (dto.bio !== undefined) updateData.bio = dto.bio;

        const result = await this.profiles_collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        return result || null;
    },

    async updateOnlineStatus(id: string, isOnline: boolean): Promise<Profile | null> {
        const result = await this.profiles_collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            {
                $set: {
                    isOnline,
                    updatedAt: new Date()
                }
            },
            { returnDocument: 'after' }
        );

        return result || null;
    },

    async delete(id: string) {
        return this.profiles_collection.deleteOne({
            _id: new ObjectId(id)
        });
    },

    async search(query: string): Promise<Profile[]> {
        return this.profiles_collection
            .find({
                $or: [
                    { username: { $regex: query, $options: 'i' } },
                    { email: { $regex: query, $options: 'i' } },
                    { games: { $regex: query, $options: 'i' } },
                    { genres: { $regex: query, $options: 'i' } }
                ]
            })
            .toArray();
    }
};