"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeagues = getLeagues;
exports.getLeague = getLeague;
exports.getTeamsByLeague = getTeamsByLeague;
const axios_1 = __importDefault(require("axios"));
const BASE_URL = "https://www.thesportsdb.com/api/v1/json/3";
async function safeApiCall(url) {
    try {
        const res = await axios_1.default.get(url);
        return res.data;
    }
    catch (err) {
        // Erreur Axios
        if (err.response) {
            throw new Error(`TheSportsDB a répondu avec une erreur : ${err.response.status}`);
        }
        // problème réseau / DNS / timeout
        if (err.request) {
            throw new Error("Impossible de contacter TheSportsDB");
        }
        throw new Error("Erreur interne Axios");
    }
}
function getLeagues() {
    return safeApiCall(`${BASE_URL}/all_leagues.php`);
}
function getLeague(leagueId) {
    return safeApiCall(`${BASE_URL}/lookupleague.php?id=${leagueId}`);
}
function getTeamsByLeague(league) {
    return safeApiCall(`${BASE_URL}/search_all_teams.php?l=${league}`);
}
