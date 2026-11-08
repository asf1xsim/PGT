// matchmaking-service/src/database/models/match.model.ts
import {ObjectId} from "mongodb";

export enum MatchStatus {
    pending = 'pending',
    accepted = 'accepted',
    declined = 'declined'
}

export default class Match {
    constructor(
        public requesterProfileId: ObjectId,
        public targetProfileId: ObjectId,
        public game: string,
        public status: MatchStatus = MatchStatus.pending,
        public message?: string,
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date()
    ) {}
}