import { Router } from "express";
import { banUser, unbanUser } from "../controllers/amdin.controllers";

const router = Router();

router.post("/ban/:id", banUser);
router.post("/unban/:id", unbanUser);


export default router;