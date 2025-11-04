"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchLeagues = fetchLeagues;
exports.fetchLeague = fetchLeague;
exports.fetchTeams = fetchTeams;
const sports_service_1 = require("../services/sports.service");
async function fetchLeagues(req, res) {
    try {
        const data = await (0, sports_service_1.getLeagues)();
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ error: "Erreur API TheSportsDB" });
    }
}
async function fetchLeague(req, res) {
    try {
        const { id } = req.params;
        const data = await (0, sports_service_1.getLeague)(id);
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ error: "Erreur API TheSportsDB" });
    }
}
async function fetchTeams(req, res) {
    try {
        const { league } = req.params;
        const data = await (0, sports_service_1.getTeamsByLeague)(league);
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ error: "Erreur API TheSportsDB" });
    }
}
