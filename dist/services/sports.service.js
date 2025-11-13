"use strict";
// ajouter gestion erreur
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeagues = getLeagues;
exports.getLeague = getLeague;
exports.getTeamsByLeague = getTeamsByLeague;
const axios_1 = __importDefault(require("axios"));
// "3" = token public gratuit / pas besoin de clé
const BASE_URL = "https://www.thesportsdb.com/api/v1/json/3";
async function getLeagues() {
    const res = await axios_1.default.get(`${BASE_URL}/all_leagues.php`);
    return res.data;
}
async function getLeague(leagueId) {
    const res = await axios_1.default.get(`${BASE_URL}/lookupleague.php?id=${leagueId}`);
    return res.data;
}
async function getTeamsByLeague(leagueName) {
    const res = await axios_1.default.get(`${BASE_URL}/search_all_teams.php?l=${leagueName}`);
    return res.data;
}
