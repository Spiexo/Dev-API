import { Router } from "express";
import { fetchLeagues, fetchLeague, fetchTeams } from "../controllers/sports.controllers";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Sports
 *   description: API TheSportsDB
 */

/**
 * @swagger
 * /sports/leagues:
 *   get:
 *     summary: Récupère toutes les ligues
 *     tags: [Sports]
 *     responses:
 *       200:
 *         description: Liste des ligues
 *       500:
 *         description: Erreur API
 */
router.get("/leagues", fetchLeagues);

/**
 * @swagger
 * /sports/league/{id}:
 *   get:
 *     summary: Récupère une ligue par ID
 *     tags: [Sports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Informations ligue
 *       500:
 *         description: Erreur API
 */
router.get("/league/:id", fetchLeague);

/**
 * @swagger
 * /sports/teams/{league}:
 *   get:
 *     summary: Récupère les équipes d'une ligue
 *     tags: [Sports]
 *     parameters:
 *       - in: path
 *         name: league
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Équipes trouvées
 *       500:
 *         description: Erreur API
 */
router.get("/teams/:league", fetchTeams);

export default router;
