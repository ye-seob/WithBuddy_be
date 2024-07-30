import { Request, Response } from "express";
import collection from "../models/userModel";
const bcrypt = require("bcrypt");

export const editUserInfo = async (req: Request, res: Response) => {
  try {
    const { newName, newPin, studentId, newInstaId, newKakaoId } = req.body;
    const user = await collection.findOne({ studentId });
    if (!user) {
      return res.status(404).send("로그인 후 다시 이용해주세요");
    }

    if (newPin) {
      const hashedNewPin = await bcrypt.hash(newPin, 5);
      user.pin = hashedNewPin;
    }

    if (newName) {
      user.name = newName;
    }
    if (newInstaId) {
      user.instaId = newInstaId;
    }
    if (newKakaoId) {
      user.newKakaoId = newKakaoId;
    }
    await user.save();

    return res.status(200).send("사용자 정보가 성공적으로 수정되었습니다.");
  } catch (error) {
    console.error("사용자 정보 수정 실패:", error);
    return res.status(500).json({ error: "서버 문제 발생" });
  }
};
