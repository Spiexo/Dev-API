"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middlewares_1 = require("../middlewares/auth.middlewares");
const user_controllers_1 = require("../controllers/user.controllers");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des profils utilisateur
 */
/**
 * @swagger
 * /user/profil:
 *   get:
 *     summary: Obtenir son propre profil
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil de l'utilisateur connecté
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get("/profil", auth_middlewares_1.authenticateToken, user_controllers_1.getMyProfil);
/**
 * @swagger
 * /user/profil/{id}:
 *   get:
 *     summary: Obtenir le profil d'un utilisateur via son ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Profil utilisateur public
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get("/profil/:id", auth_middlewares_1.authenticateToken, user_controllers_1.getUserProfil);
/**
 * @swagger
 * /user:
 *   put:
 *     summary: Modifier son profil
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EditProfileRequest'
 *     responses:
 *       200:
 *         description: Profil mis à jour avec succès
 */
router.put("/", auth_middlewares_1.authenticateToken, user_controllers_1.editProfil);
/**
 * @swagger
 * /user:
 *   delete:
 *     summary: Supprimer son compte utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteUserRequest'
 *     responses:
 *       200:
 *         description: Compte supprimé
 */
router.delete("/", auth_middlewares_1.authenticateToken, user_controllers_1.deleteUser);
exports.default = router;
