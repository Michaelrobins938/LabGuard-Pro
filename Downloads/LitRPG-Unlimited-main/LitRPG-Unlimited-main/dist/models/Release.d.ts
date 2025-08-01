import mongoose, { Document } from 'mongoose';
export interface IRelease extends Document {
    title: string;
    img: string;
}
declare const _default: mongoose.Model<IRelease, {}, {}, {}, mongoose.Document<unknown, {}, IRelease, {}, {}> & IRelease & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Release.d.ts.map