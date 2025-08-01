import mongoose, { Document, Schema } from 'mongoose';

export interface IRelease extends Document {
    title: string;
    img: string;
}

const releaseSchema = new Schema<IRelease>({
    title: { type: String, required: true },
    img: { type: String, required: true }
});

export default mongoose.model<IRelease>('Release', releaseSchema);
