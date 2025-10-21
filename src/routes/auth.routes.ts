import { Router } from "express";
import { register, login } from "../controllers/auth.controllers";

const router = Router();

router.post("/register", register);
router.post("/login", login);
// router.post("/logout", logout);
// router.post("/refresh", refreshToken);

export default router;