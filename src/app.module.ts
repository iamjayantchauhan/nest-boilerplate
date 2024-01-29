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

const envFilePath = process.env.NODE_ENV == 'test' ? '.env.test' : '.env';
const logger: LoggerConfig = new LoggerConfig();

const imports = [
  ConfigModule.forRoot({
    isGlobal: true,
    load: [configuration],
    envFilePath: envFilePath,
  }),
  WinstonModule.forRoot(logger.opts()),
  DatabaseModule.forRoot(),
  TerminusModule
];

const controllers = [AppController, HealthController];

const providers = [AppService];

@Module({
  imports: imports,
  controllers: controllers,
  providers: providers,
})
export class AppModule { }
