import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middlewares";
import { getMyProfil, getUserProfil } from "../controllers/user.controllers";

const router = Router();

router.get('/profil', authenticateToken, getMyProfil);
router.get('/profil/:id', authenticateToken, getUserProfil)

export default router;