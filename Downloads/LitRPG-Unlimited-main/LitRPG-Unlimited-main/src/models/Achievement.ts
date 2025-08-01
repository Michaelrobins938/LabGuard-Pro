import mongoose, { Document, Schema } from 'mongoose';

export interface IAchievement extends Document {
    name: string;
    description: string;
    criteria: string;
    hidden: boolean;
    tiers: Array<{
        tier: number;
        requirement: string;
        reward: string;
    }>;
}

const achievementSchema = new Schema<IAchievement>({
    name: String,
    description: String,
    criteria: String,
    hidden: { type: Boolean, default: false },
    tiers: [{
        tier: Number,
        requirement: String,
        reward: String
    }]
});

export default mongoose.model<IAchievement>('Achievement', achievementSchema);
