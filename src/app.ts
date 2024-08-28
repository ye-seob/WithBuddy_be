import express from "express";
import router from "./routes/index";
import connectDB from "./db";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import chatController from "./controllers/chatController"; // chatController 불러오기

dotenv.config();
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://www.skuwithbuddy.com", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cookieParser());

const corsOptions = {
  origin: ["https://www.skuwithbuddy.com", "http://localhost:5173"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
};

app.use(cors(corsOptions));
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

chatController(io);

app.use("/api", router);

server.listen(process.env.PORT, function () {
  console.log(` ${process.env.PORT}포트 실행 중`);
});
