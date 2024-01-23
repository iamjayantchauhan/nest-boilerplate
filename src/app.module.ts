import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

const envFilePath = process.env.NODE_ENV == 'test' ? '.env.test' : '.env';

const imports = [
  ConfigModule.forRoot({
    isGlobal: true,
    load: [configuration],
    envFilePath: envFilePath,
  }),
];

const controllers = [AppController];

const providers = [AppService];

@Module({
  imports: imports,
  controllers: controllers,
  providers: providers,
})
export class AppModule { }
