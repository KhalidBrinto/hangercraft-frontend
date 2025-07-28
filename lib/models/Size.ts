import mongoose, { Schema, Document, models } from 'mongoose';

export interface ISize extends Document {
  name: string;
}

const SizeSchema: Schema = new Schema({
  name: { type: String, required: true },
});

export default models.Size || mongoose.model<ISize>('Size', SizeSchema); 