import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dbPromise from "../config/config";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const db = await dbPromise;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Champs manquants" });
    }

    const existingUser = await db.get("SELECT id FROM users WHERE email = ?", [email]);
    if (existingUser) {
      return res.status(400).json({ error: "Cet email est déjà utilisé." });
    }

    const hashed = await bcrypt.hash(password, 10);

    const result = await db.run(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashed]
    );

    if (!result || !result.lastID) {
      return res.status(500).json({ error: "Erreur lors de la création du compte" });
    }

    const user = await db.get(
      "SELECT id, username, email FROM users WHERE id = ?",
      [result.lastID]
    );

    if (!user) {
      return res.status(500).json({ error: "Utilisateur non retrouvé après insertion" });
    }

    const token = jwt.sign(
      { id: user.id, mail: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "90d" }
    );

    res.status(201).json({
      message: "Inscription réussie",
      token,
      user,
    });
  } catch (error: any) {
    console.error("Erreur dans register():", error);

    if (error.code === "SQLITE_CONSTRAINT") {
      return res.status(400).json({ error: "Email ou nom d'utilisateur déjà existant" });
    }

    res.status(500).json({ error: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const db = await dbPromise;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Champs manquants" });
    }

    const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);
    if (!user)
      return res
        .status(401)
        .json({ error: "L'identifiant de connexion ou le mot de passe est incorrect" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res
        .status(401)
        .json({ error: "L'identifiant de connexion ou le mot de passe est incorrect" });

    const token = jwt.sign(
      { id: user.id, mail: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "90d" }
    );

    res.status(200).json({
      token,
      info: { is_premium: user.is_premium, role: user.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
};
