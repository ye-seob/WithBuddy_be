import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  group: { type: String, required: true },
});

export default mongoose.model("ChatMessage", chatSchema);
