import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PasswordDTO {
    @ApiProperty({
        type: String,
        description: 'Current password',
    })
    @IsString()
    readonly password: string;

    @ApiProperty({
        type: String,
        description: 'New password of user',
    })
    @IsString()
    readonly newPassword: string;

    constructor(passwordObject: PasswordDTO) {
        this.password = passwordObject?.password;
        this.newPassword = passwordObject?.newPassword;
    }
}