// matchmaking-service/src/types/dto/matchmaking.dto.ts
import {IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, Length, MaxLength, MinLength} from 'class-validator';

export enum SkillLevel {
    beginner = 'beginner',
    intermediate = 'intermediate',
    advanced = 'advanced',
    expert = 'expert'
}

export class MatchRequestDto {
    @IsString()
    @Length(24, 24)
    requesterProfileId!: string;

    @IsString()
    @Length(24, 24)
    targetProfileId!: string;

    @IsString()
    @MinLength(2)
    @MaxLength(100)
    game!: string;

    @IsOptional()
    @IsString()
    @MaxLength(300)
    message?: string;
}

export class FindMatchQuery {
    @IsOptional()
    @IsString({ message: 'Game must be a string' })
    game?: string;

    @IsOptional()
    @IsArray({ message: 'Genres must be an array' })
    @IsString({ each: true, message: 'Each genre must be a string' })
    genres?: string[];

    @IsOptional()
    @IsEnum(SkillLevel, { message: 'Skill level must be one of: beginner, intermediate, advanced, expert' })
    skillLevel?: SkillLevel;
}