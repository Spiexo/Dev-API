"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controllers_1 = require("../controllers/auth.controllers");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 example: mypassword
 *     responses:
 *       200:
 *         description: Succès de la connexion
 *       401:
 *         description: Identifiants invalides
 */
router.post("/register", auth_controllers_1.register);
router.post("/login", auth_controllers_1.login);
router.post("/logout", auth_controllers_1.logout);
router.post("/refresh", auth_controllers_1.refreshToken);
exports.default = router;
