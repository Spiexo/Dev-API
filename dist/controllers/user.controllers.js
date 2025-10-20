"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editProfil = exports.getUserProfil = exports.getMyProfil = void 0;
const config_1 = __importDefault(require("../config/config"));
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
const editProfil = async (req, res) => {
    try {
        const { id } = req.user;
        const db = await config_1.default;
        const { username, first_name, last_name, bio, avatar_url } = req.body;
        await db.run(`UPDATE users 
       SET username = ?, first_name = ?, last_name = ?, bio = ?, avatar_url = ?
       WHERE id = ?`, [username, first_name, last_name, bio, avatar_url, id]);
        const updatedUser = await db.get("SELECT * FROM users WHERE id = ?", [id]);
        if (!updatedUser) {
            return res.status(404).json({ error: "Utilisateur introuvable après mise à jour" });
        }
        res.status(200).json({
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
        console.error(error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
exports.editProfil = editProfil;
