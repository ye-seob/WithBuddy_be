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
    } else if (lastThree >= 60 && lastThree <= 79) {
      regex = /^[0-9]*0(6[0-9]|7[0-9])$/;
    } else if (lastThree >= 80 && lastThree <= 99) {
      regex = /^[0-9]*0(8[0-9]|9[0-9])$/;
    } else if (lastThree >= 100 && lastThree <= 119) {
      regex = /^[0-9]*1(0[0-9]|1[0-9])$/;
    } else if (lastThree >= 120 && lastThree <= 139) {
      regex = /^[0-9]*1(2[0-9]|3[0-9])$/;
    } else if (lastThree >= 140 && lastThree <= 159) {
      regex = /^[0-9]*1(4[0-9]|5[0-9])$/;
    } else if (lastThree >= 160 && lastThree <= 179) {
      regex = /^[0-9]*1(6[0-9]|7[0-9])$/;
    } else if (lastThree >= 180 && lastThree <= 199) {
      regex = /^[0-9]*1(8[0-9]|9[0-9])$/;
    } else if (lastThree >= 200 && lastThree <= 219) {
      regex = /^[0-9]*2(0[0-9]|1[0-9])$/;
    } else if (lastThree >= 220 && lastThree <= 239) {
      regex = /^[0-9]*2(2[0-9]|3[0-9])$/;
    } else if (lastThree >= 240 && lastThree <= 259) {
      regex = /^[0-9]*2(4[0-9]|5[0-9])$/;
    } else if (lastThree >= 260 && lastThree <= 279) {
      regex = /^[0-9]*2(6[0-9]|7[0-9])$/;
    } else if (lastThree >= 280 && lastThree <= 299) {
      regex = /^[0-9]*2(8[0-9]|9[0-9])$/;
    } else if (lastThree >= 300 && lastThree <= 319) {
      regex = /^[0-9]*3(0[0-9]|1[0-9])$/;
    } else if (lastThree >= 320 && lastThree <= 339) {
      regex = /^[0-9]*3(2[0-9]|3[0-9])$/;
    } else if (lastThree >= 340 && lastThree <= 359) {
      regex = /^[0-9]*3(4[0-9]|5[0-9])$/;
    } else if (lastThree >= 360 && lastThree <= 379) {
      regex = /^[0-9]*3(6[0-9]|7[0-9])$/;
    } else if (lastThree >= 380 && lastThree <= 399) {
      regex = /^[0-9]*3(8[0-9]|9[0-9])$/;
    } else {
      return res.status(400).send("적절한 학번 구간에 속하지 않습니다.");
    }

    const buddys = await collection.find(
      {
        major: major,
        studentId: { $regex: regex },
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
    console.error("Error while matching students:", error);
    return res.status(500).send("서버 오류 발생");
  }
};
