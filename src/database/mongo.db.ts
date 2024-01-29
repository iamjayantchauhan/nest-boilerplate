import { Module, DynamicModule, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Module({})
export default class DatabaseModule {
    private static readonly logger = new Logger();

    public static getNoSqlConnectionString(config: ConfigService): string {
        const dbdata = config.get<string>('database');
        if (!dbdata) {
            DatabaseModule.logger.error('Unable to connect with DB');
        }
        return dbdata;
    }

    public static forRoot(): DynamicModule {
        return {
            module: DatabaseModule,
            imports: [
                MongooseModule.forRootAsync({
                    imports: [ConfigModule],
                    useFactory: (config: ConfigService) => ({
                        uri: DatabaseModule.getNoSqlConnectionString(config),
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                        autoIndex: false,
                    }),
                    inject: [ConfigService],
                }),
            ],
            controllers: [],
            providers: [],
            exports: [],
        };
    }
}