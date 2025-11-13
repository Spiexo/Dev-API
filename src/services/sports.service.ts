import axios from "axios";

const BASE_URL = "https://www.thesportsdb.com/api/v1/json/3";

async function safeApiCall(url: string) {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (err: any) {
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

export function getLeagues() {
  return safeApiCall(`${BASE_URL}/all_leagues.php`);
}

export function getLeague(leagueId: string) {
  return safeApiCall(`${BASE_URL}/lookupleague.php?id=${leagueId}`);
}

export function getTeamsByLeague(league: string) {
  return safeApiCall(`${BASE_URL}/search_all_teams.php?l=${league}`);
}
