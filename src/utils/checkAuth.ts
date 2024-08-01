import { Request, Response, NextFunction } from "express";
import collection from "../models/userModel";
const jwt = require("jsonwebtoken");

const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.accessToken;
    console.log(req.cookies);
    if (!token) {
      return res.status(401).send("토큰이 누락되었습니다");
    }

    next();
  } catch (error) {
    return res.status(401).send("토큰이 만료되었습니다");
  }
};
const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;

    console.log(req.cookies);
    if (!token) {
      return res
        .status(401)
        .json({ message: "리프레시 토큰이 전달되지 않았습니다." });
    }

    let data;
    try {
      data = jwt.verify(token, process.env.REFRESH_SECRET);
    } catch (error) {
      return res
        .status(403)
        .json({ message: "유효하지 않은 리프레시 토큰입니다." });
    }

    const user = await collection.findOne({ studentId: data.studentId });

    if (!user) {
      return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
    }

    const newAccessToken = jwt.sign(
      {
        studentId: user.studentId,
        userName: user.name,
        major: user.major,
      },
      process.env.ACCESS_SECRET,
      { expiresIn: "10m", issuer: "About Tech" }
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
    });

    return res
      .status(200)
      .json({ message: "새로운 액세스 토큰이 발급되었습니다." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 에러가 발생했습니다." });
  }
};

export { checkAuth, refreshToken };
