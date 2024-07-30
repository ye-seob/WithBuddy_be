import express from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import mailRoutes from "./mailRoutes";
import matchRoutes from "./matchRoutes";
import rakingRoutes from "./rankingRoutes";

const router = express.Router();

router.use("/api/user", userRoutes);
router.use("/api/auth", authRoutes);
router.use("/api/mail", mailRoutes);
router.use("/api/match", matchRoutes);
router.use("/api/ranking", rakingRoutes);

export default router;
