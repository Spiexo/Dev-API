"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const config_1 = __importDefault(require("../config/config"));
const requireRole = (roleAsked) => {
    return async (req, res, next) => {
        try {
            const user = req.user;
            if (!user)
                return res.status(401).json({ message: "Non authentifié" });
            const db = await config_1.default;
            const { role } = await db.get("SELECT role FROM users WHERE id = ?", [
                user.id,
            ]);
            if (role !== roleAsked) {
                return res.status(403).json({ message: "Accès réservé" });
            }
            next();
        }
        catch (err) {
            return res.status(403).json({ message: "Token invalide" });
        }
    };
};
exports.requireRole = requireRole;
