import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';

@Schema({ _id: false })
class UserOTP extends Document {
    @Prop()
    value: number;

    @Prop({ default: false })
    used: boolean;
}

/**
 * User schema
 */
@Schema({ collection: 'users', timestamps: true })
export class User extends Document {
    @Prop({ required: true, unique: true })
    emailAddress: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    firstName: string;

    @Prop()
    lastName: string;

    @Prop({ type: Boolean, default: false })
    isVerified: boolean;

    @Prop({ type: UserOTP })
    otp: UserOTP;
}

const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(uniqueValidator);

UserSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

export { UserSchema };
