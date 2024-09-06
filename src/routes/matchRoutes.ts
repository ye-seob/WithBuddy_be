import express from "express";
import { groupMatch, personalMatch } from "../controllers/matchController";
import { checkAuth } from "../utils/checkAuth";

const router = express.Router();

router.get("/groupMatch", checkAuth, groupMatch);
router.get("/personaMatch", checkAuth, personalMatch);

export default router;
