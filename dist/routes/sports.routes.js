"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sports_controllers_1 = require("../controllers/sports.controllers");
const router = (0, express_1.Router)();
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
router.get("/leagues", sports_controllers_1.fetchLeagues);
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
router.get("/league/:id", sports_controllers_1.fetchLeague);
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
router.get("/teams/:league", sports_controllers_1.fetchTeams);
exports.default = router;
