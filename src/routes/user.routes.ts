import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middlewares";
import { editProfil, getMyProfil, getUserProfil, deleteUser } from "../controllers/user.controllers";

const router = Router();

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
router.get("/profil", authenticateToken, getMyProfil);

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
router.get("/profil/:id", authenticateToken, getUserProfil);

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
router.put("/", authenticateToken, editProfil);

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
router.delete("/", authenticateToken, deleteUser);

export default router;
