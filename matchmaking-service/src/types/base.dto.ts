// matchmaking-service/src/types/base.dto.ts
import { IsString, Length, IsOptional, IsInt, Min } from 'class-validator';

export class IdParam {
    @IsString()
    @Length(24, 24)
    id!: string;  // Добавить восклицательный знак
}

export class PaginationDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number = 1;  // Добавить значение по умолчанию

    @IsOptional()
    @IsInt()
    @Min(1)
    limit?: number = 10;  // Добавить значение по умолчанию
}