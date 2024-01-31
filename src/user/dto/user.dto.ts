import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UserDTO {
    @ApiProperty({
        type: String,
        description: 'Email address of user',
    })
    @IsEmail()
    readonly email: string;

    @ApiProperty({
        type: String,
        description: 'Password of user',
    })
    readonly password: string;

    @ApiProperty({
        type: String,
        description: 'First name of user',
    })
    @IsString()
    readonly firstName: string;

    @ApiProperty({
        type: String,
        description: 'Last name of user',
    })
    @IsString()
    readonly lastName: string;

    constructor(userObject: UserDTO) {
        this.email = userObject?.email;
        this.password = userObject?.password;
        this.firstName = userObject?.firstName;
        this.lastName = userObject?.lastName;
    }
}