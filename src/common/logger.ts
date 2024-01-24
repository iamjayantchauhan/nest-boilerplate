import * as path from 'path';

import * as dotenv from 'dotenv';
import * as winston from 'winston';
import { format, transports } from 'winston';
import * as CloudWatchTransport from 'winston-cloudwatch';

dotenv.config();

const options = {
    errorFile: {
        level: 'error',
        filename: path.join(__dirname, '../../logs', 'error.log'),
        handleExceptions: false,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 10,
        colorize: false,
        silent: false,
    },
    console: {
        level: 'warn',
        handleExceptions: false,
        json: false,
        colorize: true,
        silent: false,
    },
    file: {
        level: 'info',
        filename: path.join(__dirname, '../../logs', 'combined.log'),
        handleExceptions: false,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 10,
        colorize: false,
        silent: false,
    },
};
export class LoggerConfig {
    private readonly options: winston.LoggerOptions;
    private localTransports = [
        new transports.File(options.errorFile),
        new transports.Console(options.console),
        new transports.File(options.file),
    ];

    private serverTransports = [
        new CloudWatchTransport({
            logGroupName: process.env.CLOUDWATCH_GROUP_NAME,
            logStreamName: process.env.CLOUDWATCH_STREAM_NAME,
            awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
            awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
            awsRegion: process.env.AWS_REGION,
            name: 'Cloudwatch Logs',
            messageFormatter: function (item) {
                return item.level + ': ' + item.message + ' ' + JSON.stringify(item);
            },
        }),
    ];

    constructor() {
        this.options = {
            exitOnError: false,
            format: format.combine(format.timestamp(), format.prettyPrint()),
            transports:
                process.env.NODE_ENV === 'local'
                    ? this.localTransports
                    : this.serverTransports,
            exceptionHandlers: [
                new transports.File({
                    filename: path.join(__dirname, '../../logs', 'exceptions.log'),
                }),
            ],
        };
    }

    public opts(): winston.LoggerOptions {
        return this.options;
    }
}