import mongoose, { Schema, Document, models } from 'mongoose';

export interface IColor extends Document {
  name: string;
  hexCode: string;
}

const ColorSchema: Schema = new Schema({
  name: { type: String, required: true },
  hexCode: { type: String, required: true },
});

export default models.Color || mongoose.model<IColor>('Color', ColorSchema); 