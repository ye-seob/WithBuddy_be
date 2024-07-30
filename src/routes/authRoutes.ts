import { Router } from "express";

import { refreshToken } from "../utils/checkAuth";

const router = Router();

router.post("/refreshToken", refreshToken);

export default router;
