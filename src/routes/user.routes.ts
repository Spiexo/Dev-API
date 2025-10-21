import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middlewares";
import { editProfil, getMyProfil, getUserProfil, deleteUser } from "../controllers/user.controllers";

const router = Router();

router.get('/profil', authenticateToken, getMyProfil);
router.get('/profil/:id', authenticateToken, getUserProfil)
router.put('/', authenticateToken, editProfil);
router.delete('/', authenticateToken, deleteUser);

export default router;