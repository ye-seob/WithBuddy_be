import express from "express";
import { createServer } from "https";
import fs from "fs";
import { Server } from "socket.io";
import router from "./routes/index";
import connectDB from "./db";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import chatController from "./controllers/chatController";

// 환경 변수 로드
dotenv.config();

const app = express();
const httpsOptions = {
  key: fs.readFileSync(
    "7ada883f939b58c9cac331a58a164147d495c8a3c1270af86640f1767ec31950"
  ), // SSL 인증서의 비밀 키
  cert: fs.readFileSync(
    "049b34ec90ffe5b1a86af2f11f001798cbbc022d7c71b59f8b396a6b8b9b67d7"
  ), // SSL 인증서
};
const httpsServer = createServer(httpsOptions, app);

// CORS 설정
const corsOptions = {
  origin: ["https://www.skuwithbuddy.com", "http://localhost:5173"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
};
app.use(cors(corsOptions));

// 미들웨어 설정
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 라우터 설정
app.use("/api", router);

// 데이터베이스 연결
connectDB();

// Socket.io 설정
const io = new Server(httpsServer, {
  cors: {
    origin: ["https://www.skuwithbuddy.com", "http://localhost:5173"],
  },
});

chatController(io);

httpsServer.listen(process.env.PORT, function () {
  console.log(`${process.env.PORT} 포트에서 서버가 실행 중입니다.`);
});
