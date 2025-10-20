"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"
    if (!token) {
        return res.status(401).json({ message: "Accès refusé, token manquant" });
    }
    try {
        const secret = process.env.JWT_SECRET || "changeme";
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        // @ts-ignore : on ajoute user dynamiquement
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(403).json({ message: "Token invalide" });
    }
};
exports.authenticateToken = authenticateToken;
