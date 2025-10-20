import { Request, Response } from "express";
import dbPromise from "../config/config";
import { User } from "../models/user.models";

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
    const db = await dbPromise;

    const { username, first_name, last_name, bio, avatar_url } = req.body;

    await db.run(
      `UPDATE users 
       SET username = ?, first_name = ?, last_name = ?, bio = ?, avatar_url = ?
       WHERE id = ?`,
      [username, first_name, last_name, bio, avatar_url, id]
    );

    const updatedUser = await db.get<User>("SELECT * FROM users WHERE id = ?", [id]);

    if (!updatedUser) {
      return res.status(404).json({ error: "Utilisateur introuvable après mise à jour" });
    }

    res.status(200).json({
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
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
