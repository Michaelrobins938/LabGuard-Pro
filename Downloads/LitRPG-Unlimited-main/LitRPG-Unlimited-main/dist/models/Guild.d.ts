import mongoose, { Document } from 'mongoose';
export interface IGuild extends Document {
    name: string;
    points: number;
}
declare const _default: mongoose.Model<IGuild, {}, {}, {}, mongoose.Document<unknown, {}, IGuild, {}, {}> & IGuild & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Guild.d.ts.map