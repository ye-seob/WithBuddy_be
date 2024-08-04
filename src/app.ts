import express from "express";
import router from "./routes/index";

import connectDB from "./db";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const cors = require("cors");

const app = express();

app.use(cookieParser());

const corsOptions = {
  origin: [
    "https://web-withbuddy-fe-lz9xefyc65850cc3.sel4.cloudtype.app",
    "https://www.skuwithbuddy.com",
    "https://port-0-withbuddy-be-lz9xefyc65850cc3.sel4.cloudtype.app",
    "http://localhost:5173",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
};

app.use(cors(corsOptions));
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", router);

app.listen(process.env.PORT, function () {
  console.log(` ${process.env.PORT}포트 실행 중`);
});
