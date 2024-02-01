import {
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PasswordDTO } from 'src/auth/dto/password.dto';
import { UtilityService } from 'src/utils/utils.service';
import { Logger } from 'winston';
import { UserDTO } from './dto/user.dto';
import { User } from './schema/user.schema';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly config: ConfigService,
        private readonly utilService: UtilityService,
    ) { }

    /**
     * Create user
     * @param {UserDTO} user User DTO
     * @returns {Promise<User>}
     */
    async createUser(user: UserDTO): Promise<User> {
        const currentUser = await this.userModel.findOne({
            emailAddress: user?.email,
        });

        if (currentUser) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(user.password, salt);
        const generatedOTP = this.utilService.generateRandomOTP();

        const newUser = new this.userModel({
            emailAddress: user?.email,
            password: hashPassword,
            firstName: user?.firstName,
            lastName: user?.lastName,
            isVerified: false,
            otp: {
                used: false,
                value: generatedOTP,
            },
        });

        await this.utilService.sendOTPEmail(generatedOTP, user?.email);
        return newUser.save();
    }

    /**
     * Get all users
     * @returns {Promise<User[]>}
     */
    async getAllUsers(auth: string): Promise<Record<string, any>> {
        const jwtResponse = this.utilService.decodeJWT(auth);

        const response = await this.userModel.find({
            emailAddress: { $ne: jwtResponse?.emailAddress },
        });

        return {
            message: 'List retrieved sucessfully',
            data: response,
        };
    }

    /**
     * Delete user from application
     * @param {string} userId Delete user ID
     * @returns {Promise<User>}
     */
    async deleteUser(userId: string): Promise<User> {
        const deletedUser = await this.userModel.findByIdAndRemove(userId);
        if (!deletedUser) {
            const message = `Delete user for #${userId} has failed`;
            this.logger.error(message);
            throw new NotFoundException(message);
        }
        return deletedUser;
    }

    /**
     * Delete user by email
     * @param {string} email User's email
     */
    async deleteUserByEmail(email: string) {
        await this.userModel.findOneAndRemove({ emailAddress: email });
    }

    /**
     * Get single user based on ID
     * @param {string} userId User ID
     * @returns {Promise<Record<string, any>>}
     */
    async getUser(userId: string): Promise<Record<string, any>> {
        const singleUser = await this.userModel.findById(userId)

        if (!singleUser) {
            const message = `User for #${userId} not found`;
            this.logger.error(message);
            throw new NotFoundException(message);
        }
        return {
            message: "User retrieved successfully",
            data: singleUser
        };
    }

    /**
     * Get user by email
     * @param {string} email User email
     * @returns {Promise<User>}
     */
    async getUserByEmail(email: string): Promise<User> {
        const singleUser = await this.userModel.findOne({
            emailAddress: email,
        });

        return singleUser;
    }

    /**
     * Update user account
     * @param {string} userId User ID
     * @param {UserDTO} userDTO User data
     * @returns 
     */
    async updateUser(userId: string, userDTO: UserDTO) {
        try {
            const existingDBUser = await this.userModel.findOne({
                emailAddress: userDTO?.email,
            });

            if (
                existingDBUser?.emailAddress === userDTO?.email &&
                userId !== existingDBUser?._id?.toString()
            ) {
                throw new HttpException(
                    'User with same email already exists',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const currentUser = await this.userModel.findOne({
                _id: userId,
            });

            if (!currentUser) {
                const message = `User for #${userId} not found`;
                this.logger.error(message);
                throw new HttpException(message, HttpStatus.BAD_REQUEST);
            }

            const updateUserResponse = await this.userModel.findOneAndUpdate(
                { _id: userId },
                {
                    emailAddress: userDTO?.email,
                    // password: hashPassword,
                    firstName: userDTO?.firstName,
                    lastName: userDTO?.lastName,
                },
                { new: true },
            );

            return {
                message: 'Updated successfully',
                data: updateUserResponse,
            };
        } catch (exception) {
            this.logger.error(`Update user failed with ${exception}`);
            throw exception;
        }
    }

    /**
     * Find user by ID and update the password
     * @param {string} auth 
     * @param {PasswordDTO} passwordDTO Password DTO
     * @returns {Promise<Record<string, any>>}
     */
    async findUserByIDAndUpdatePassword(
        auth: string,
        passwordDTO: PasswordDTO,
    ): Promise<Record<string, any>> {
        try {
            const jwtResponse = this.utilService.decodeJWT(auth);
            const currentUser = await this.getUserByEmail(jwtResponse?.emailAddress);

            const compare = bcrypt.compareSync(
                passwordDTO?.password,
                currentUser?.password,
            );

            if (passwordDTO?.newPassword === passwordDTO?.password) {
                throw new HttpException(
                    'New password & old password can not be same',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!compare) {
                throw new HttpException(
                    'Passwords are not matching',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(passwordDTO?.newPassword, salt);

            const updatePasswordResponse = await this.userModel.findByIdAndUpdate(
                { _id: currentUser?._id },
                { password: hashedPassword },
                { new: true },
            );
            return {
                message: 'Password updated successfully',
                data: updatePasswordResponse,
            };
        } catch (exception) {
            this.logger.error(`User update password failed with ${exception}`);
            throw exception;
        }
    }

    /**
     * Deactivate user account
     * @param {string} userId User ID
     * @returns {Promise<Record<string, any>>}
     */
    async deactivateUser(userId: string): Promise<Record<string, any>> {
        try {
            const currentUser = await this.userModel.findById(userId);
            if (!currentUser) {
                throw new HttpException(
                    'User not available, Please try again',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const updatePasswordResponse = await this.userModel.findByIdAndUpdate(
                { _id: currentUser?._id },
                { isDeactivated: true },
                { new: true },
            );
            return {
                message: 'Password updated successfully',
                data: updatePasswordResponse,
            };
        } catch (exception) {
            this.logger.error(`Deactivate user failed for ID ${userId}`);
            throw exception;
        }
    }

    /**
     * Reset user password details
     * @param {string} userId User ID
     * @returns {Promise<Record<string, any>>}
     */
    async resetUserPassword(userId: string): Promise<Record<string, any>> {
        try {
            const currentUser = await this.userModel.findById(userId);
            if (!currentUser) {
                throw new HttpException(
                    'User not available, Please try again',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const password = this.utilService.randomPassword();
            const emailDetails = {
                to: currentUser?.emailAddress,
                from: this.config.get('email.user'),
                subject: 'Reset Password Request',
                html: `Your new password <b>${password}</b>`,
            };

            const salt = await bcrypt.genSalt();
            const hashPassword = await bcrypt.hash(password, salt);

            const response = await this.userModel.findByIdAndUpdate(userId, {
                password: hashPassword,
            });

            this.utilService.sendEmail(emailDetails);

            return {
                message: 'Reset password email sent successful',
                data: response,
            };
        } catch (exception) {
            this.logger.error(`Deactivate user failed for ID ${userId}`);
            throw exception;
        }
    }

    /**
     * Change user password
     * @param {string} userEmail User Email
     * @param {string} password Password
     * @returns {Promise<Record<string, any>>}
     */
    async changeUserPassword(userEmail: string, password: string): Promise<Record<string, any>> {
        try {
            const currentUser: Record<string, any> = await this.getUserByEmail(
                userEmail,
            );

            if (!currentUser) {
                throw new HttpException(
                    'User not found, Please try again',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);

            await this.userModel.findByIdAndUpdate(
                { _id: currentUser?._id },
                { password: hashedPassword },
                { new: true },
            );

            return {
                message: 'Password changed successfully',
                data: {},
            };
        } catch (exception) {
            this.logger.error(`Change password failed for the user: ${userEmail}`);
            throw exception;
        }
    }
}