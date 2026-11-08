// auth-service/src/types/auth.dto.ts
import {IsEmail, IsNotEmpty, IsOptional, Length} from 'class-validator';

export class RegisterDto {
    @IsNotEmpty({ message: 'Username is required' })
    @Length(3, 30, { message: 'Username must have between 3 and 30 characters' })
    username: string;

    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    @Length(6, 100, { message: 'Password must have between 6 and 100 characters' })
    password: string;
}

export class LoginDto {
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    password: string;
}

export class UpdateUserDto {
    @IsOptional()
    @Length(3, 30, { message: 'Username must have between 3 and 30 characters' })
    username?: string;

    @IsOptional()
    @IsEmail({}, { message: 'Invalid email format' })
    email?: string;

    @IsOptional()
    @Length(6, 100, { message: 'Password must have between 6 and 100 characters' })
    password?: string;
}

export class IdParam {
    @IsNotEmpty({ message: 'Id is required' })
    @Length(24, 24, { message: 'Id must have 24 characters' })
    id?: string;
}