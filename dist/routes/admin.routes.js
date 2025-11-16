"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middlewares_1 = require("../middlewares/auth.middlewares");
const role_middlewares_1 = require("../middlewares/role.middlewares");
const admin_controllers_1 = require("../controllers/admin.controllers");
const router = (0, express_1.Router)();
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
router.put("/ban/:id", auth_middlewares_1.authenticateToken, (0, role_middlewares_1.requireRole)("admin"), admin_controllers_1.banUser);
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
router.put("/unban/:id", auth_middlewares_1.authenticateToken, (0, role_middlewares_1.requireRole)("admin"), admin_controllers_1.unbanUser);
exports.default = router;
