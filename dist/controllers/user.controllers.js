"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.editProfil = exports.getAllUsers = exports.getUserProfil = exports.getMyProfil = void 0;
const config_1 = __importDefault(require("../config/config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// Récupérer le profil de l'utilisateur connecté
const getMyProfil = async (req, res) => {
    try {
        const { id } = req.user;
        const db = await config_1.default;
        const user = await db.get("SELECT * FROM users WHERE id = ?", [id]);
        if (!user) {
            return res.status(404).json({ error: "Utilisateur introuvable" });
        }
        res.status(200).json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                bio: user.bio,
                avatar_url: user.avatar_url,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
exports.getMyProfil = getMyProfil;
// Récupérer le profil d'un utilisateur par son ID
const getUserProfil = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await config_1.default;
        const user = await db.get("SELECT * FROM users WHERE id = ?", [id]);
        if (!user) {
            return res.status(404).json({ error: "Utilisateur introuvable" });
        }
        res.status(200).json({
            user: {
                id: user.id,
                username: user.username,
                firstName: user.first_name,
                lastName: user.last_name,
                bio: user.bio,
                avatar_url: user.avatar_url,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
exports.getUserProfil = getUserProfil;
// Récupérer tous les utilisateurs avec pagination
const getAllUsers = async (req, res) => {
    try {
        const db = await config_1.default;
        // Paramètres de pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const offset = (page - 1) * limit;
        // Récupération des utilisateurs avec pagination
        const users = await db.all("SELECT id, username, email FROM users LIMIT ? OFFSET ?", [limit, offset]);
        // Récupération du nombre total d'utilisateurs
        const totalResult = await db.get("SELECT COUNT(*) as count FROM users");
        const total = totalResult?.count || 0;
        res.status(200).json({
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            data: users,
        });
    }
    catch (error) {
        console.error("Erreur dans getAllUsers:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
exports.getAllUsers = getAllUsers;
// Éditer le profil de l'utilisateur connecté
const editProfil = async (req, res) => {
    try {
        const { id } = req.user;
        if (!id) {
            return res.status(401).json({ error: "Utilisateur non authentifié" });
        }
        const db = await config_1.default;
        const allowedFields = ["username", "first_name", "last_name", "bio", "avatar_url"];
        const updates = Object.entries(req.body)
            .filter(([key, value]) => allowedFields.includes(key) && value !== undefined);
        if (updates.length === 0) {
            return res.status(400).json({ error: "Aucune donnée à mettre à jour" });
        }
        const fields = updates.map(([key]) => `${key} = ?`).join(", ");
        const values = updates.map(([_, value]) => value);
        values.push(id);
        const result = await db.run(`UPDATE users SET ${fields} WHERE id = ?`, values);
        if (result.changes === 0) {
            return res.status(404).json({ error: "Utilisateur introuvable ou inchangé" });
        }
        const updatedUser = await db.get("SELECT * FROM users WHERE id = ?", [id]);
        if (!updatedUser) {
            return res.status(404).json({ error: "Utilisateur introuvable après mise à jour" });
        }
        res.status(200).json({
            message: "Profil mis à jour avec succès",
            user: {
                id: updatedUser.id,
                username: updatedUser.username,
                email: updatedUser.email,
                firstName: updatedUser.first_name,
                lastName: updatedUser.last_name,
                bio: updatedUser.bio,
                avatar_url: updatedUser.avatar_url,
            },
        });
    }
    catch (error) {
        console.error("Erreur dans editProfil:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
exports.editProfil = editProfil;
// Supprimer le compte de l'utilisateur connecté
const deleteUser = async (req, res) => {
    try {
        const { id } = req.user;
        const { passwordTest } = req.body;
        if (!passwordTest) {
            return res.status(400).json({ message: "Mot de passe requis." });
        }
        const db = await config_1.default;
        const user = await db.get("SELECT username, password FROM users WHERE id=?", [id]);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable." });
        }
        const { username, password } = user;
        const match = await bcrypt_1.default.compare(passwordTest, password);
        if (!match) {
            return res.status(401).json({ message: "Mot de passe incorrect." });
        }
        const result = await db.run("DELETE FROM users WHERE id=?", [id]);
        if (result && result.changes && result.changes > 0) {
            return res.status(200).json({
                message: `L'utilisateur ${username} a été supprimé avec succès.`,
            });
        }
        else {
            return res.status(404).json({ message: "Échec de la suppression." });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
};
exports.deleteUser = deleteUser;
