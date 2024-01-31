import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UtilityService } from './utils.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [ConfigModule, JwtModule],
    providers: [UtilityService],
    exports: [UtilityService],
})
export class UtilityModule { }