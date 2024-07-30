import { Router } from "express";
import { sendMail, checkAuthCode, sendFindMail } from "../utils/sendMail";

const router = Router();

router.post("/send-mail", sendMail);
router.post("/checkAuthCode", checkAuthCode);
router.post("/send-findPin-mail", sendFindMail);

export default router;
