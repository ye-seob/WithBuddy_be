import * as nodeMailer from "nodemailer";
import { Request, Response } from "express";
import dotenv from "dotenv";
import collection from "../models/userModel";
const crypto = require("crypto");
const bcrypt = require("bcrypt");

dotenv.config();
const myEmail = process.env.EMAIL;
const password = process.env.PASSWORD;

const makeCode = () => {
  return crypto.randomBytes(3).toString("hex");
};

const makePin = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const authCodes: { [key: string]: string } = {};

export const sendMail = async (req: Request, res: Response) => {
  const { email }: { email: string } = req.body;

  try {
    const existingUser = await collection.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json("이미 가입된 이메일입니다.");
    }

    const code = makeCode();
    authCodes[email] = code;

    const transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: myEmail,
        pass: password,
      },
    });

    const mailOptions = {
      from: { name: "WithBuddy", address: `${myEmail}` },
      to: email,
      subject: "WithBuddy 가입 인증 메일",
      html: `
        ${code}
    `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).send("이메일 전송 성공");
  } catch (error) {
    console.log(error);
    res.status(500).send("이메일 전송 실패");
  }
};
export const sendFindMail = async (req: Request, res: Response) => {
  const { email, studentId }: { email: string; studentId: string } = req.body;

  try {
    const existingUser = await collection.findOne({
      email: email,
      studentId: studentId,
    });

    if (!existingUser) {
      return res.status(400).json("가입 되지않은 이메일 또는 학번입니다.");
    }

    const newPin = makePin();
    const hashingPassword = await bcrypt.hash(newPin, 5);

    await collection.updateOne(
      { email: email, studentId: studentId },
      { $set: { pin: hashingPassword } }
    );

    const transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: myEmail,
        pass: password,
      },
    });

    const mailOptions = {
      from: { name: "WithBuddy", address: `${myEmail}` },
      to: email,
      subject: "WithBuddy Pin 번호 재발급 메일",
      html: `
       <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>WithBuddyPin 번호 재발급 안내</h2>
    <p>안녕하세요,</p>
    <p>Pin 번호를 변경하시려면 로그인 후 수정 페이지에서 변경하실 수 있습니다.</p>
    <h3 style="color: #0066cc;">재발급된 Pin 번호: ${newPin}</h3>
    <p>감사합니다.<br>WithBuddy</p>
    </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).send("이메일 전송 성공");
  } catch (error) {
    console.log(error);
    res.status(500).send("이메일 전송 실패");
  }
};

export const checkAuthCode = async (req: Request, res: Response) => {
  const { email, authCode } = req.body;

  try {
    const storedCode = authCodes[email];
    if (!storedCode) {
      return res.status(400).send("인증 코드가 없습니다.");
    }

    if (authCode !== storedCode) {
      return res.status(400).send("불일치");
    }
    delete authCodes[email];

    res.status(200).send("일치");
  } catch (error) {
    res.status(500).send("서버 오류");
  }
};
