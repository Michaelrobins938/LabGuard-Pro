import mongoose, { Document } from 'mongoose';
export interface IQuest extends Document {
    name: string;
    description: string;
    expReward: number;
    achievementUnlock: string;
}
declare const _default: mongoose.Model<IQuest, {}, {}, {}, mongoose.Document<unknown, {}, IQuest, {}, {}> & IQuest & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Quest.d.ts.map