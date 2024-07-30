import express from "express";
import { match } from "../controllers/matchController";
import { checkAuth } from "../utils/checkAuth";

const router = express.Router();

router.get("/", checkAuth, match);

export default router;
