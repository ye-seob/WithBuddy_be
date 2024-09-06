import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  room: {
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
  name: {
    type: String,
    required: true,
  },
});

export default mongoose.model("ChatMessage", chatSchema);
