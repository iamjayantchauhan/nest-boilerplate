import {
    Body,
    Controller,
    Delete,
    Get,
    Headers,
    HttpStatus,
    Param,
    Post,
    Put,
    Res
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UtilityService } from 'src/utils/utils.service';
import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private utilService: UtilityService,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Retrieve all users' })
    @ApiResponse({
        status: StatusCodes.OK,
        description: "Retrieve all users",
    })
    async getAllUsers(
        @Res() response: Response,
        @Headers('Authorization') auth: string,
    ) {
        try {
            const userData = await this.userService.getAllUsers(auth);
            return response.status(HttpStatus.OK).send({ ...userData });
        } catch (exception) {
            return this.utilService.catchResponse({
                res: response,
                error: exception,
            });
        }
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Get single user' })
    async getUser(@Res() response: Response, @Param('id') userId: string) {
        try {
            const userData = await this.userService.getUser(userId);
            return response.status(HttpStatus.OK).send({ ...userData });
        } catch (exception) {
            return this.utilService.catchResponse({
                res: response,
                error: exception,
            });
        }
    }

    @Delete('/:id')
    @ApiOperation({ summary: 'Delete single user' })
    async deleteUser(@Res() response: Response, @Param('id') userId: string) {
        try {
            const userData = await this.userService.deleteUser(userId);
            return response.status(HttpStatus.OK).send({ ...userData });
        } catch (exception) {
            return this.utilService.catchResponse({
                res: response,
                error: exception,
            });
        }
    }

    @Post()
    @ApiOperation({ summary: 'Create a single user' })
    async createUser(@Res() response: Response, @Body() userDTO: UserDTO) {
        try {
            const userData = await this.userService.createUser(userDTO);
            return response.status(HttpStatus.CREATED).send(userData);
        } catch (exception) {
            return this.utilService.catchResponse({
                res: response,
                error: exception,
            });
        }
    }

    @Put('/:id')
    @ApiOperation({ summary: 'Update single user' })
    async updateUser(
        @Res() response: Response,
        @Param('id') userId: string,
        @Body() userDTO: UserDTO,
    ) {
        try {
            const userData = await this.userService.updateUser(userId, userDTO);
            return response.status(HttpStatus.OK).send({ ...userData });
        } catch (exception) {
            return this.utilService.catchResponse({
                res: response,
                error: exception,
            });
        }
    }

    @Put('deactivate/:id')
    @ApiOperation({ summary: 'Deactivate user' })
    async deactivateUser(@Res() response: Response, @Param('id') userId: string) {
        try {
            const responseData = await this.userService.deactivateUser(userId);
            return response.status(HttpStatus.OK).send({ ...responseData });
        } catch (exception) {
            return this.utilService.catchResponse({
                res: response,
                error: exception,
            });
        }
    }

    @Put('/reset-password/:id')
    @ApiOperation({ summary: 'Send reset password email' })
    async resetUserPassword(
        @Res() response: Response,
        @Param('id') userId: string,
    ) {
        try {
            const userData = await this.userService.resetUserPassword(userId);
            return response.status(HttpStatus.OK).send({ ...userData });
        } catch (exception) {
            return this.utilService.catchResponse({
                res: response,
                error: exception,
            });
        }
    }
}