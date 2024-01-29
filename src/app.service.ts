import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class AppService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly config: ConfigService,
  ) { }

  /**
   * Retrieve API version
   * @returns {string} API version
   */
  getVersion(): string {
    this.logger.info(
      `Request received for version ${this.config.get('api_version')}`,
    );
    return this.config.get('api_version');
  }
}