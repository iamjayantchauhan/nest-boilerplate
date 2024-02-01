import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerConfig } from './common/logger';
import configuration from './config/configuration';
import DatabaseModule from './database/mongo.db';
import { TerminusModule } from '@nestjs/terminus';
import HealthController from './health/health.controller';
import { UserModule } from './user/user.module';
import { UtilityModule } from './utils/utils.module';
import { MailerModule } from '@nestjs-modules/mailer';

const envFilePath = process.env.NODE_ENV == 'test' ? '.env.test' : '.env';
const logger: LoggerConfig = new LoggerConfig();

const imports = [
  ConfigModule.forRoot({
    isGlobal: true,
    load: [configuration],
    envFilePath: envFilePath,
  }),
  MailerModule.forRoot({
    transport: {
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    },
  }),
  WinstonModule.forRoot(logger.opts()),
  DatabaseModule.forRoot(),
  TerminusModule,
  UtilityModule,
  UserModule
];

const controllers = [AppController, HealthController];

const providers = [AppService];

@Module({
  imports: imports,
  controllers: controllers,
  providers: providers,
})
export class AppModule { }
