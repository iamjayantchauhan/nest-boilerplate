import { Inject, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import * as crypto from 'crypto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ConfigService } from '@nestjs/config';
export interface ICatchResponseParameters {
    res: Response;
    error: any;
}

@Injectable()
export class UtilityService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly mailService: MailerService,
        private readonly config: ConfigService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) { }

    catchResponse = ({ res, error }: ICatchResponseParameters) => {
        const statusCode: number = error?.status || 500;
        return res.status(statusCode).json({
            success: false,
            error: error.message,
        });
    };

    decodeJWT = (auth: string): Record<string, any> => {
        const jwt = auth.replace('Bearer ', '');
        return this.jwtService.decode(jwt, { json: true }) as {
            uuid: string;
        };
    };

    divideListIntoChunks = (
        sourceArray: Record<string, any>[],
        chunkSize: number,
    ) => {
        const resultArray = [];
        for (let i = 0; i < sourceArray?.length; i += chunkSize) {
            const chunk = sourceArray.slice(i, i + chunkSize);
            resultArray.push(chunk);
        }
        return resultArray;
    };

    randomPassword = () => {
        const length = 10;
        const wishlist =
            '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$';

        return Array.from(crypto.randomFillSync(new Uint32Array(length)))
            .map((x) => wishlist[x % wishlist.length])
            .join('');
    };

    sendEmail = (emailDetails: Record<string, any>) => {
        this.mailService
            .sendMail(emailDetails)
            .then((success) => {
                this.logger.info(
                    `Email sent successfully with ${JSON.stringify(success)}`,
                );
            })
            .catch((err) => {
                this.logger.info(`Email sending failed with ${err.message}`);
            });
    };

    getDomainFromEmail = (email: string) => {
        return email?.split('@')[1];
    };

    generateRandomOTP = () => {
        return Math.floor(100000 + Math.random() * 900000);
    };

    async sendOTPEmail(otp: number, emailAddress: string) {
        const emailDetails = {
            to: emailAddress,
            from: this.config.get('email.user'),
            subject: 'Test Subject',
            html: `Your OTP <b>${otp}</b>`,
        };

        this.sendEmail(emailDetails);
    }
}