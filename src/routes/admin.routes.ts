import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middlewares";    
import { requireRole } from "../middlewares/role.middlewares";
import { banUser, unbanUser } from "../controllers/admin.controllers";

const router = Router();

router.post("/ban/:id", authenticateToken, requireRole("admin"), banUser);
router.post("/unban/:id", authenticateToken, requireRole("admin"), unbanUser);


export default router;