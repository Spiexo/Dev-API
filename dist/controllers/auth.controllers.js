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
        // regex pour verifier la complexité du mot de passe
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(.{8,})$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                error: "Le mot de passe doit contenir au moins 8 caractères, une majuscule et un caractère spécial."
            });
        }
        const db = await config_1.default;
        const existingUser = await db.get("SELECT id FROM users WHERE email = ?", [email]);
        if (existingUser) {
            return res.status(400).json({ error: "Cet email est déjà utilisé." });
        }
        const hashed = await bcrypt_1.default.hash(password, 10);
        const result = await db.run("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hashed]);
        if (!result || !result.lastID) {
            return res.status(500).json({ error: "Erreur lors de la création du compte" });
        }
        const user = await db.get("SELECT id, username, email FROM users WHERE id = ?", [result.lastID]);
        if (!user) {
            return res.status(500).json({ error: "Utilisateur non retrouvé après insertion" });
        }
        const accessToken = jsonwebtoken_1.default.sign({ id: user.id, mail: user.email }, process.env.JWT_SECRET, { expiresIn: "15m" });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user.id, mail: user.email }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await db.run("INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)", [user.id, refreshToken, expiresAt.toISOString()]);
        res.status(201).json({
            message: "Inscription réussie",
            accessToken,
            user,
        });
    }
    catch (error) {
        console.error("Erreur dans register():", error);
        // Gérer les erreurs de contrainte unique (ex: email déjà existant), race condition
        if (error.code === "SQLITE_CONSTRAINT") {
            return res.status(400).json({
                error: "Email ou nom d'utilisateur déjà existant"
            });
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
        if (user.is_banned) {
            return res.status(403).json({ error: "Vous êtes banni" });
        }
        const match = await bcrypt_1.default.compare(password, user.password);
        if (!match)
            return res.status(401).json({ error: "Identifiants incorrects" });
        const accessToken = jsonwebtoken_1.default.sign({ id: user.id, mail: user.email }, process.env.JWT_SECRET, { expiresIn: "15m" });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user.id, mail: user.email }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
        // Stocker le refresh token dans la bdd
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 j
        await db.run("INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)", [user.id, refreshToken, expiresAt.toISOString()]);
        res.status(200).json({
            accessToken,
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
        const { email, password } = req.body;
        const db = await config_1.default;
        if (!email || !password) {
            return res.status(400).json({ error: "Email et mot de passe requis" });
        }
        const user = await db.get("SELECT id, password FROM users WHERE email = ?", [email]);
        if (!user) {
            return res.status(404).json({ error: "Utilisateur introuvable" });
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Mot de passe incorrect" });
        }
        const result = await db.run("DELETE FROM refresh_tokens WHERE user_id = ?", [user.id]);
        if (result.changes === 0) {
            return res.status(200).json({
                message: "Déconnexion réussie (aucun token actif trouvé).",
            });
        }
        res.status(200).json({ message: "Déconnexion réussie — tous les tokens ont été supprimés." });
    }
    catch (error) {
        console.error("Erreur lors du logout :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
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
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const newAccessToken = jsonwebtoken_1.default.sign({ id: decoded.id, mail: decoded.mail }, process.env.JWT_SECRET, { expiresIn: "15m" });
        res.status(200).json({ accessToken: newAccessToken });
    }
    catch (error) {
        console.error(error);
        res.status(403).json({ error: "Refresh token invalide ou expiré" });
    }
};
exports.refreshToken = refreshToken;
