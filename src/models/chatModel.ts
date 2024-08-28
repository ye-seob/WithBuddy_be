import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  group: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("ChatMessage", chatSchema);
