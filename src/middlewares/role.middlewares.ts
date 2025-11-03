import { Request, Response, NextFunction } from "express";
import dbPromise from "../config/config";
// Définir un type RequestWithUser pour inclure les informations utilisateur
type RequestWithUser = Request & {
  user?: {
    id: any;
    role?: string;
  };
};

// Middleware pour vérifier le rôle de l'utilisateur
export const requireRole = (roleAsked: string) => {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ message: "Non authentifié" });

      const db = await dbPromise;
      const { role } = await db.get("SELECT role FROM users WHERE id = ?", [
        user.id,
      ]);
      if (role !== roleAsked) {
        return res.status(403).json({ message: "Accès réservé" });
      }

      next();
    } catch (err) {
      return res.status(403).json({ message: "Token invalide" });
    }
  };
};
