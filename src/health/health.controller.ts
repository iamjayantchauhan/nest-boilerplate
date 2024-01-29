import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
    HealthCheckService,
    HealthCheck,
    MongooseHealthIndicator,
} from '@nestjs/terminus';

@Controller({
    path: 'health',
})
@ApiTags('Health')
export default class HealthController {
    constructor(
        private health: HealthCheckService,
        private db: MongooseHealthIndicator,
    ) { }

    @Get()
    @ApiOkResponse({ description: 'API Health Check' })
    @ApiOperation({ summary: 'Check health of the application' })
    @HealthCheck()
    check() {
        return this.health.check([() => this.db.pingCheck('mongodb')]);
    }
}