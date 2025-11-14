"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unbanUser = exports.banUser = void 0;
const config_1 = __importDefault(require("../config/config"));
const banUser = async (req, res) => {
    try {
        const { id: userIdToBan } = req.params; // id à bannir
        const db = await config_1.default;
        // Vérifier que l'utilisateur existe
        const target = await db.get("SELECT id FROM users WHERE id = ?", [userIdToBan]);
        if (!target)
            return res.status(404).json({ error: "Utilisateur introuvable" });
        // Mettre le flag is_banned = 1
        await db.run("UPDATE users SET is_banned = 1 WHERE id = ?", [userIdToBan]);
        // Supprimer tous les refresh tokens liés (force logout)
        await db.run("DELETE FROM refresh_tokens WHERE user_id = ?", [userIdToBan]);
        res.status(200).json({ message: `Utilisateur ${userIdToBan} banni.` });
    }
    catch (error) {
        console.error("banUser error:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
exports.banUser = banUser;
const unbanUser = async (req, res) => {
    try {
        const { id: userId } = req.params;
        const db = await config_1.default;
        const target = await db.get("SELECT id FROM users WHERE id = ?", [userId]);
        if (!target)
            return res.status(404).json({ error: "Utilisateur introuvable" });
        await db.run("UPDATE users SET is_banned = 0 WHERE id = ?", [userId]);
        res.status(200).json({ message: `Utilisateur ${userId} débanni.` });
    }
    catch (error) {
        console.error("unbanUser error:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
exports.unbanUser = unbanUser;
