"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
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
        // Vérifie si l'email est déjà utilisé
        const existingUser = await db.get("SELECT id FROM users WHERE email = ?", [email]);
        if (existingUser) {
            return res.status(400).json({ error: "Cet email est déjà utilisé." });
        }
        const hashed = await bcrypt_1.default.hash(password, 10);
        // Insertion
        const result = await db.run("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hashed]);
        if (!result || !result.lastID) {
            return res.status(500).json({ error: "Erreur lors de la création du compte" });
        }
        // Récupération de l’utilisateur inséré
        const user = await db.get("SELECT id, username, email FROM users WHERE id = ?", [result.lastID]);
        if (!user) {
            return res.status(500).json({ error: "Utilisateur non retrouvé après insertion" });
        }
        // Création du token JWT
        const token = jsonwebtoken_1.default.sign({ id: user.id, mail: user.email }, process.env.JWT_SECRET, { expiresIn: "90d" });
        res.status(201).json({
            message: "Inscription réussie",
            token,
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
        const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);
        if (!user)
            return res
                .status(401)
                .json({ error: "L'identifiant de connexion ou le mot de passe est incorrect" });
        const match = await bcrypt_1.default.compare(password, user.password);
        if (!match)
            return res
                .status(401)
                .json({ error: "L'identifiant de connexion ou le mot de passe est incorrect" });
        const token = jsonwebtoken_1.default.sign({ id: user.id, mail: user.email }, process.env.JWT_SECRET, { expiresIn: "90d" });
        res.status(200).json({
            token,
            info: { is_premium: user.is_premium, role: user.role },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Login failed" });
    }
};
exports.login = login;
