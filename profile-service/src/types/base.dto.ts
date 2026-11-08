// profile-service/src/types/base.dto.ts
import { IsString, Length, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class IdParam {
    @IsString()
    @Length(24, 24)
    id: string;
}

export class PaginationDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    page?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    limit?: number;
}