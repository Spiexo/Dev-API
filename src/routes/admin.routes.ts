import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middlewares";
import { requireRole } from "../middlewares/role.middlewares";
import { banUser, unbanUser } from "../controllers/admin.controllers";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Gestion administrative des utilisateurs
 */

/**
 * @swagger
 * /admin/ban/{id}:
 *   put:
 *     summary: Bannir un utilisateur
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur à bannir
 *     responses:
 *       200:
 *         description: Utilisateur banni avec succès
 *       403:
 *         description: Accès refusé (non administrateur)
 */
router.put("/ban/:id", authenticateToken, requireRole("admin"), banUser);

/**
 * @swagger
 * /admin/unban/{id}:
 *   put:
 *     summary: Débannir un utilisateur
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur à débannir
 *     responses:
 *       200:
 *         description: Utilisateur débanni avec succès
 *       403:
 *         description: Accès refusé (non administrateur)
 */
router.put("/unban/:id", authenticateToken, requireRole("admin"), unbanUser);

export default router;
