import mongoose, { Document, Schema } from 'mongoose';

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

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    character: String,
    level: {
        type: Number,
        default: 1
    },
    exp: {
        type: Number,
        default: 0
    },
    skills: {
        type: [String],
        default: []
    },
    alignment: String,
    companion: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    activationToken: String,
    activationTokenExpires: Date,
    isActivated: {
        type: Boolean,
        default: false
    }
});

export default mongoose.model<IUser>('User', userSchema);
