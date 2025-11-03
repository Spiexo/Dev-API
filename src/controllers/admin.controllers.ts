// admin.controllers.ts
import { Request, Response } from "express";
import dbPromise from "../config/config";

// Bannir un utilisateur par son ID
export const banUser = async (req: Request, res: Response) => {
  try {
    const { id: userIdToBan } = req.params;
    const db = await dbPromise;
 
    const target = await db.get("SELECT id FROM users WHERE id = ?", [userIdToBan]);
    if (!target) return res.status(404).json({ error: "Utilisateur introuvable" });

    await db.run("UPDATE users SET is_banned = 1 WHERE id = ?", [userIdToBan]);

    await db.run("DELETE FROM refresh_tokens WHERE user_id = ?", [userIdToBan]);

    res.status(200).json({ message: `Utilisateur ${userIdToBan} banni.` });
  } catch (error) {
    console.error("banUser error:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Débannir un utilisateur par son ID
export const unbanUser = async (req: Request, res: Response) => {
  try {
    const { id: userId } = req.params;
    const db = await dbPromise;

    const target = await db.get("SELECT id FROM users WHERE id = ?", [userId]);
    if (!target) return res.status(404).json({ error: "Utilisateur introuvable" });

    await db.run("UPDATE users SET is_banned = 0 WHERE id = ?", [userId]);

    res.status(200).json({ message: `Utilisateur ${userId} débanni.` });
  } catch (error) {
    console.error("unbanUser error:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
