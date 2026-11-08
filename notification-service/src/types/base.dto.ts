// notification-service/src/types/base.dto.ts
import { IsString, Length, IsOptional, IsInt, Min } from 'class-validator';

export class IdParam {
    @IsString()
    @Length(24, 24)
    id!: string;
}

export class PaginationDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @IsInt()
    @Min(1)
    limit?: number = 10;
}