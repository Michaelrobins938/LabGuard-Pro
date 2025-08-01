import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IAchievement, {}, {}, {}, mongoose.Document<unknown, {}, IAchievement, {}, {}> & IAchievement & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Achievement.d.ts.map