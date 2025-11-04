import { Request, Response } from "express";
import { getLeagues, getLeague, getTeamsByLeague } from "../services/sports.service";

export async function fetchLeagues(req: Request, res: Response) {
  try {
    const data = await getLeagues();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Erreur API TheSportsDB" });
  }
}

export async function fetchLeague(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data = await getLeague(id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Erreur API TheSportsDB" });
  }
}

export async function fetchTeams(req: Request, res: Response) {
  try {
    const { league } = req.params;
    const data = await getTeamsByLeague(league);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Erreur API TheSportsDB" });
  }
}
