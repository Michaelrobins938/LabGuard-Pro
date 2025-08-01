import mongoose, { Document, Schema } from 'mongoose';

export interface IGuild extends Document {
    name: string;
    points: number;
}

const guildSchema = new Schema<IGuild>({
    name: { type: String, unique: true },
    points: { type: Number, default: 0 }
});

export default mongoose.model<IGuild>('Guild', guildSchema);
