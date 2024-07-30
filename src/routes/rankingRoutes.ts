import { Router } from "express";
import { loadRanking } from "../controllers/rankingController";
import { checkAuth } from "../utils/checkAuth";

const router = Router();

router.get("/loadRanking", checkAuth, loadRanking);

export default router;
