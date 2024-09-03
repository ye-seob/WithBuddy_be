import { Request, Response } from "express";
import collection from "../models/userModel";

export const match = async (req: Request, res: Response) => {
  const major = req.query.major as string | undefined;
  const studentId = req.query.studentId as string | undefined;

  if (!studentId) {
    return res.status(400).send("로그인 후 다시 이용해주세요.");
  }

  try {
    const lastThree = parseInt(studentId.slice(-3), 10);
    let regex;

    if (lastThree >= 1 && lastThree <= 19) {
      regex = /^[0-9]*0(0[1-9]|1[0-9])$/;
    } else if (lastThree >= 20 && lastThree <= 39) {
      regex = /^[0-9]*0(2[0-9]|3[0-9])$/;
    } else if (lastThree >= 40 && lastThree <= 59) {
      regex = /^[0-9]*0(4[0-9]|5[0-9])$/;
    } else if (lastThree >= 60 && lastThree <= 90) {
      regex = /^[0-9]*0(6[0-9]|7[0-9]|8[0-9]|90)$/;
    } else if (lastThree > 90 && lastThree <= 200) {
      regex = /^[0-9]*(9[1-9]|1[0-9][0-9]|200)$/;
    } else {
      return res.status(400).send("적절한 학번 구간에 속하지 않습니다.");
    }

    const filter: any = { studentId: { $regex: regex } };
    if (major) filter.major = major;

    const buddys = await collection.find(filter, {
      name: 1,
      major: 1,
      studentId: 1,
      instaId: 1,
      kakaoId: 1,
      mbti: 1,
      bio: 1,
      _id: 0,
    });

    return res.status(200).json(buddys);
  } catch (error) {
    console.error("Error while matching students:", error);
    return res.status(500).send("서버 오류 발생");
  }
};
