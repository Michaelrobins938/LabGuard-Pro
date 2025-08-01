import mongoose, { Document, Schema } from 'mongoose';

export interface IQuest extends Document {
    name: string;
    description: string;
    expReward: number;
    achievementUnlock: string;
}

const questSchema = new Schema<IQuest>({
    name: String,
    description: String,
    expReward: Number,
    achievementUnlock: String
});

export default mongoose.model<IQuest>('Quest', questSchema);
