"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const requireRole = (role) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user)
            return res.status(401).json({ message: "Non authentifié" });
        if (user.role !== role) {
            return res.status(403).json({ message: "Accès réservé" });
        }
        next();
    };
};
exports.requireRole = requireRole;
