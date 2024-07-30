import { Router } from "express";
import {
  login,
  signup,
  logout,
  deleteUser,
} from "../controllers/userController";
import { editUserInfo } from "../controllers/editController";
import { checkAuth } from "../utils/checkAuth";

const router = Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);

router.put("/edit", checkAuth, editUserInfo);
router.delete("/deleteUser", checkAuth, deleteUser);

export default router;
