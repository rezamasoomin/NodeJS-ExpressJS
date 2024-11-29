import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(8)
    @MaxLength(100)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character'
    })
    password!: string;

    constructor(partial: Partial<CreateUserDto> = {}) {
        Object.assign(this, partial);
    }
}

export class UpdateUserDto {
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name?: string;

    @IsEmail()
    email?: string;

    constructor(partial: Partial<UpdateUserDto> = {}) {
        Object.assign(this, partial);
    }
}