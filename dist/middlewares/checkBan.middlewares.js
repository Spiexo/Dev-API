"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkBan = void 0;
const config_1 = __importDefault(require("../config/config"));
const checkBan = async (req, res, next) => {
    try {
        const db = await config_1.default;
        const { id } = req.user;
        const user = await db.get("SELECT is_banned FROM users WHERE id = ?", [id]);
        if (!user) {
            return res.status(404).json({ error: "Utilisateur introuvable" });
        }
        if (user.is_banned) {
            return res.status(403).json({ error: "Vous êtes banni" });
        }
        next();
    }
    catch (err) {
        return res.status(403).json({ message: "Token invalide" });
    }
};
exports.checkBan = checkBan;
