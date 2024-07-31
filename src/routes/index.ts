import express from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import mailRoutes from "./mailRoutes";
import matchRoutes from "./matchRoutes";
import rakingRoutes from "./rankingRoutes";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/auth", authRoutes);
router.use("/mail", mailRoutes);
router.use("/match", matchRoutes);
router.use("/ranking", rakingRoutes);

export default router;
