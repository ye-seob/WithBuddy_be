import { Request, Response } from "express";
import collection from "../models/userModel";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
import Major from "../models/majorModel";

export const login = async (req: Request, res: Response) => {
  try {
    const { studentId, pin }: { studentId: string; pin: string } = req.body;

    const user = await collection.findOne({ studentId });

    if (!user) return res.status(404).send("등록되지 않은 학번입니다");

    const passwordMatching = await bcrypt.compare(pin, user.pin);
    if (passwordMatching) {
      const accessToken: string = jwt.sign(
        {
          studentId: user.studentId,
          userName: user.name,
          major: user.major,
        },
        process.env.ACCESS_SECRET,
        { expiresIn: "15m", issuer: "About Tech" }
      );

      const refreshToken: string = jwt.sign(
        {
          studentId: user.studentId,
          userName: user.name,
          major: user.major,
        },
        process.env.REFRESH_SECRET,
        { expiresIn: "24h", issuer: "About Tech" }
      );
      res.cookie("accessToken", accessToken, {
        secure: true,
        sameSite: "none",
        httpOnly: true,
        domain: "skuwithbuddy.com",
      });
      res.cookie("refreshToken", refreshToken, {
        secure: true,
        sameSite: "none",
        httpOnly: true,
        domain: "skuwithbuddy.com",
      });

      const response = {
        userName: user.name,
        major: user.major,
        instaId: user.instaId,
        kakaoId: user.kakaoId,
        mbti: user.mbti,
        bio: user.bio,
      };

      res.status(200).send(response);
    } else {
      res.status(401).send("비밀번호가 일치하지 않습니다.");
    }
  } catch (error) {
    res.status(500).json({ error: "서버 문제 발생" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
      httpOnly: true,
      //서브도메인은 제외한다
      domain: "skuwithbuddy.com",
    });
    res.clearCookie("refreshToken", {
      secure: true,
      sameSite: "none",
      httpOnly: true,
      domain: "skuwithbuddy.com",
    });
    res.status(200).json({
      message: "로그아웃 성공",
    });
  } catch (error) {
    res.status(500).json({ error: "서버 문제 발생" });
    console.error(error);
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const {
      name,
      studentId,
      major,
      pin,
      pinConfirm,
      email,
      instaId,
      kakaoId,
      mbti,
      bio,
    } = req.body;

    if (pin != pinConfirm) {
      return res.status(400).json("pin번호 불일치");
    }
    const existingUser = await collection.findOne({ studentId });

    if (existingUser) {
      return res.status(400).json("이미 가입된 학번입니다.");
    }
    const hashingPassword = await bcrypt.hash(pin, 5);
    await collection.create({
      name,
      studentId,
      major,
      pin: hashingPassword,
      email,
      instaId,
      kakaoId,
      mbti,
      bio,
    });

    res.status(200).send("회원가입 성공했습니다.");
    await Major.findOneAndUpdate(
      { name: major },
      { $inc: { number: 1 } },
      { new: true, upsert: true }
    );
  } catch (error) {
    res.status(500).json({ error: "서버 문제 발생" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const studentId = req.body.studentId;

    const user = await collection.findOne({ studentId });
    const result = await collection.deleteOne(user);

    if (result.deletedCount === 1) {
      await Major.findOneAndUpdate(
        { name: user.major },
        { $inc: { number: -1 } },
        { new: true, upsert: true }
      );
      res.status(200).send("삭제되었습니다.");
    } else {
      res.status(404).send("삭제에 실패했습니다");
    }
  } catch (error) {
    res.status(500).json({ error: "서버 문제 발생" });
  }
};
