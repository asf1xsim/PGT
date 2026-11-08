// profile-service/src/database/profile.model.ts
import { ObjectId } from 'mongodb';

export enum SkillLevel {
    beginner = 'beginner',
    intermediate = 'intermediate',
    advanced = 'advanced',
    expert = 'expert'
}

export interface Profile {
    _id?: ObjectId;
    userId: ObjectId;
    username: string;
    email: string;
    games: string[];
    genres: string[];
    playtimes?: string[];
    languages?: string[];
    skillLevel?: SkillLevel;
    availability?: string[];
    bio?: string;
    isOnline: boolean;
    createdAt: Date;
    updatedAt?: Date;
}

export default Profile;