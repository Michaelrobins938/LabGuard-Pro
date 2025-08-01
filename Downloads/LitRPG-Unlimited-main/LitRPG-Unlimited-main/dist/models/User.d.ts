import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    character?: string;
    level: number;
    exp: number;
    skills: string[];
    alignment?: string;
    companion?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    activationToken?: string;
    activationTokenExpires?: Date;
    isActivated?: boolean;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=User.d.ts.map