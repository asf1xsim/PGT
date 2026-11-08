// auth-service/src/services/auth.service.ts
import {ObjectId} from "mongodb";
import mongo from "../database/mongo";
import * as crypto from "crypto";

interface UserCredentials {
    username: string;
    email: string;
    password: string;
}

interface LoginCredentials {
    email: string;
    password: string;
}

export const authService = {
    users_collection: mongo.db.collection("users"),

    hashPassword(password: string): string {
        return crypto
            .createHash('sha256')
            .update(password)
            .digest('hex');
    },

    generateToken(): string {
        return crypto.randomBytes(32).toString('hex');
    },

    async register(credentials: UserCredentials) {
        const existingUser = await this.users_collection
            .findOne({email: credentials.email});

        if (existingUser) {
            throw new Error('User already exists');
        }

        const user = {
            username: credentials.username,
            email: credentials.email,
            passwordHash: this.hashPassword(credentials.password),
            token: this.generateToken(),
            createdAt: new Date()
        };

        const result = await this.users_collection.insertOne(user);

        return {
            id: result.insertedId,
            username: user.username,
            email: user.email,
            token: user.token
        };
    },

    async login(credentials: LoginCredentials) {
        const user = await this.users_collection.findOne({
            email: credentials.email,
            passwordHash: this.hashPassword(credentials.password)
        });

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const newToken = this.generateToken();
        await this.users_collection.updateOne(
            {_id: user._id},
            {$set: {token: newToken, lastLogin: new Date()}}
        );

        return {
            id: user._id,
            username: user.username,
            email: user.email,
            token: newToken
        };
    },

    async verifyToken(token: string) {
        const user = await this.users_collection.findOne({token});
        return user;
    },

    async getUserById(id: string) {
        return this.users_collection
            .findOne({_id: new ObjectId(id)});
    },

    async logout(token: string) {
        return this.users_collection.updateOne(
            {token},
            {$unset: {token: ""}}
        );
    },

    async deleteUser(id: string) {
        return this.users_collection.deleteOne({
            _id: new ObjectId(id)
        });
    },

    async updateUser(id: string, data: Partial<UserCredentials>) {
        const updateData: any = {};

        if (data.username) updateData.username = data.username;
        if (data.email) updateData.email = data.email;
        if (data.password) {
            updateData.passwordHash = this.hashPassword(data.password);
        }

        return this.users_collection.findOneAndUpdate(
            {_id: new ObjectId(id)},
            {$set: updateData},
            {returnDocument: 'after'}
        );
    }
};