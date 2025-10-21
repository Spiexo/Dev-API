"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.logout = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: "Champs manquants" });
        }
        const db = await config_1.default;
        // email unique ?
        const existingUser = await db.get("SELECT id FROM users WHERE email = ?", [email]);
        if (existingUser) {
            return res.status(400).json({ error: "Cet email est déjà utilisé." });
        }
        const hashed = await bcrypt_1.default.hash(password, 10);
        // Insérer l'utilisateur
        const result = await db.run("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hashed]);
        if (!result || !result.lastID) {
            return res.status(500).json({ error: "Erreur lors de la création du compte" });
        }
        // Récupérer l'utilisateur inséré
        const user = await db.get("SELECT id, username, email FROM users WHERE id = ?", [result.lastID]);
        if (!user) {
            return res.status(500).json({ error: "Utilisateur non retrouvé après insertion" });
        }
        const accessToken = jsonwebtoken_1.default.sign({ id: user.id, mail: user.email }, process.env.JWT_SECRET, { expiresIn: "15m" });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user.id, mail: user.email }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7j
        await db.run("INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)", [user.id, refreshToken, expiresAt.toISOString()]);
        res.status(201).json({
            message: "Inscription réussie",
            accessToken,
            refreshToken, // ou n'envoyer que l'accessToken si tu utilises cookie pour le refresh
            user,
        });
    }
    catch (error) {
        console.error("Erreur dans register():", error);
        if (error.code === "SQLITE_CONSTRAINT") {
            return res.status(400).json({ error: "Email ou nom d'utilisateur déjà existant" });
        }
        res.status(500).json({ error: "Registration failed" });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const db = await config_1.default;
        if (!email || !password) {
            return res.status(400).json({ error: "Champs manquants" });
        }
        const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);
        if (!user)
            return res.status(401).json({ error: "Identifiants incorrects" });
        const match = await bcrypt_1.default.compare(password, user.password);
        if (!match)
            return res.status(401).json({ error: "Identifiants incorrects" });
        const accessToken = jsonwebtoken_1.default.sign({ id: user.id, mail: user.email }, process.env.JWT_SECRET, { expiresIn: "15m" });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user.id, mail: user.email }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 j
        await db.run("INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)", [user.id, refreshToken, expiresAt.toISOString()]);
        res.status(200).json({
            accessToken,
            refreshToken,
            info: { is_premium: user.is_premium, role: user.role },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Login failed" });
    }
};
exports.login = login;
const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const db = await config_1.default;
        if (!refreshToken)
            return res.status(400).json({ error: "Aucun refresh token fourni" });
        await db.run("DELETE FROM refresh_tokens WHERE token = ?", [refreshToken]);
        res.status(200).json({ message: "Déconnexion réussie" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la déconnexion" });
    }
};
exports.logout = logout;
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const db = await config_1.default;
        if (!refreshToken)
            return res.status(401).json({ error: "Aucun refresh token fourni" });
        const stored = await db.get("SELECT * FROM refresh_tokens WHERE token = ?", [refreshToken]);
        if (!stored)
            return res.status(403).json({ error: "Refresh token invalide" });
        // Vérifier expiration
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        // Générer un nouveau token d'accès
        const newAccessToken = jsonwebtoken_1.default.sign({ id: decoded.id, mail: decoded.mail }, process.env.JWT_SECRET, { expiresIn: "15m" });
        res.status(200).json({ accessToken: newAccessToken });
    }
    catch (error) {
        console.error(error);
        res.status(403).json({ error: "Refresh token invalide ou expiré" });
    }
};
exports.refreshToken = refreshToken;
