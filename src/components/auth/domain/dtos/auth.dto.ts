import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(6)
    password!: string;

    constructor(partial: Partial<LoginDto> = {}) {
        Object.assign(this, partial);
    }
}