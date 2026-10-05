import mongoose, { Schema, Document } from "mongoose";

export interface IRabbitHole extends Document {
  topic: string;
  summary: string;
  script: string;
  audioUrl?: string; // The URL/base64 to the generated audio
  followUps: string[];
  createdAt: Date;
}

const RabbitHoleSchema: Schema = new Schema({
  topic: { type: String, required: true },
  summary: { type: String, required: true },
  script: { type: String, required: true },
  audioUrl: { type: String, required: false },
  followUps: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.RabbitHole || mongoose.model<IRabbitHole>("RabbitHole", RabbitHoleSchema);
