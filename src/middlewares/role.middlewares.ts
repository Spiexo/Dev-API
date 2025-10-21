import { Request, Response, NextFunction } from "express";

type RequestWithUser = Request & { user?: { role?: string } };

export const requireRole = (role: string) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Non authentifié" });

    if (user.role !== role) {
      return res.status(403).json({ message: "Accès réservé" });
    }

    next();
  };
};