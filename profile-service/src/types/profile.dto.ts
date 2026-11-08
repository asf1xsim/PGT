// profile-service/src/types/profile.dto.ts
import { IsString, IsEmail, IsArray, IsOptional, MinLength, MaxLength, IsEnum, IsBoolean } from 'class-validator';

export enum SkillLevel {
    beginner = 'beginner',
    intermediate = 'intermediate',
    advanced = 'advanced',
    expert = 'expert'
}

export class ProfileDto {
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    username: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    games?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    genres?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    playtimes?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    languages?: string[];

    @IsOptional()
    @IsEnum(SkillLevel)
    skillLevel?: SkillLevel;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    availability?: string[];

    @IsOptional()
    @IsString()
    @MaxLength(500)
    bio?: string;

    @IsOptional()
    @IsBoolean()
    isOnline?: boolean;
}

export class SearchQuery {
    @IsString()
    @MinLength(1)
    query: string;
}

export class OnlineStatusDto {
    @IsBoolean()
    isOnline: boolean;
}
