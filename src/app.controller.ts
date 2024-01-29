import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';
import { AppService } from './app.service';

@Controller()
@ApiTags('Version')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @ApiOperation({ summary: 'Check version of the application' })
  @ApiResponse({
    status: StatusCodes.OK,
    type: '',
    description: 'Retrieve version of API',
  })
  getVersion(): string {
    return this.appService.getVersion();
  }
}