const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB 연결 성공");
  } catch (error) {
    console.error("DB 연결 실패:", error);
  }
}

module.exports = connectDB;
