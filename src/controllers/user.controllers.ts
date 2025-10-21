import { Request, Response } from "express";
import dbPromise from "../config/config";
import { User } from "../models/user.models";
import bcrypt from "bcrypt";

export const getMyProfil = async (req: any, res: Response) => {
  try {
    const { id } = req.user;
    const db = await dbPromise;

    const user = await db.get<User>("SELECT * FROM users WHERE id = ?", [id]);

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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getUserProfil = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await dbPromise;

    const user = await db.get<User>("SELECT * FROM users WHERE id = ?", [id]);

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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const editProfil = async (req: any, res: Response) => {
  try {
    const { id } = req.user;
    if (!id) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    const db = await dbPromise;
    const allowedFields = ["username", "first_name", "last_name", "bio", "avatar_url"];

    const updates = Object.entries(req.body)
      .filter(([key, value]) => allowedFields.includes(key) && value !== undefined);

    if (updates.length === 0) {
      return res.status(400).json({ error: "Aucune donnée à mettre à jour" });
    }

    const fields = updates.map(([key]) => `${key} = ?`).join(", ");
    const values = updates.map(([_, value]) => value);
    values.push(id);

    const result = await db.run(
      `UPDATE users SET ${fields} WHERE id = ?`,
      values
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: "Utilisateur introuvable ou inchangé" });
    }

    const updatedUser = await db.get<User>("SELECT * FROM users WHERE id = ?", [id]);
    if (!updatedUser) {
      return res.status(404).json({ error: "Utilisateur introuvable après mise à jour" });
    }

    res.status(200).json({
      message: "Profil mis à jour avec succès",
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
  } catch (error) {
    console.error("Erreur dans editProfil:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const deleteUser = async (req: any, res: Response) => {
  try {
    const { id } = req.user;
    const { passwordTest } = req.body;

    if (!passwordTest) {
      return res.status(400).json({ message: "Mot de passe requis." });
    }

    const db = await dbPromise;
    const user = await db.get(
      "SELECT username, password FROM users WHERE id=?",
      [id]
    );

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    const { username, password } = user;

    const match = await bcrypt.compare(passwordTest, password);
    if (!match) {
      return res.status(401).json({ message: "Mot de passe incorrect." });
    }

    const result = await db.run("DELETE FROM users WHERE id=?", [id]);

    if (result && result.changes && result.changes > 0) {
      return res.status(200).json({
        message: `L'utilisateur ${username} a été supprimé avec succès.`,
      });
    } else {
      return res.status(404).json({ message: "Échec de la suppression." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};