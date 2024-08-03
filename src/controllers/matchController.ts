import { Request, Response } from "express";
import collection from "../models/userModel";

export const match = async (req: Request, res: Response) => {
  const major = req.query.major as string | undefined;
  const studentId = req.query.studentId as string | undefined;

  if (!studentId) {
    return res.status(400).send("로그인 후 다시 이용해주세요.");
  }

  try {
    const lastThree = studentId.slice(-3);
    const buddys = await collection.find(
      {
        major: major,
        studentId: { $regex: `${lastThree}$` },
      },
      {
        name: 1,
        major: 1,
        studentId: 1,
        instaId: 1,
        kakaoId: 1,
        mbti: 1,
        bio: 1,
        _id: 0,
      }
    );
    return res.status(200).json(buddys);
  } catch (error) {
    return res.status(500).send("서버 오류 발생");
  }
};
