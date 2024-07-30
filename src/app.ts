import express, { Application } from "express";
import router from "./routes/index";

import connectDB from "./db";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const cors = require("cors");

const app: Application = express();

app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:5173",
  withCredentials: true,
  credentials: true,
};

app.use(
  cors({
    origin: [
      "https://web-withbuddy-fe-lz8vrmt22573d2de.sel4.cloudtype.app/",
      "https://port-0-withbuddy-be-lz8vrmt22573d2de.sel4.cloudtype.app/",
      "http://localhost:5173",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  })
);

app.use(cors(corsOptions));

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(router);

app.listen(process.env.PORT, function () {
  console.log(` ${process.env.PORT}포트 실행 중`);
});
