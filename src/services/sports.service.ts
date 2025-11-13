// ajouter gestion erreur


import axios from "axios";

// "3" = token public gratuit / pas besoin de clé
const BASE_URL = "https://www.thesportsdb.com/api/v1/json/3"; 

export async function getLeagues() {
  const res = await axios.get(`${BASE_URL}/all_leagues.php`);
  return res.data;
}
export async function getLeague(leagueId: string) {
  const res = await axios.get(`${BASE_URL}/lookupleague.php?id=${leagueId}`);
  return res.data;
}

export async function getTeamsByLeague(leagueName: string) {
  const res = await axios.get(`${BASE_URL}/search_all_teams.php?l=${leagueName}`);
  return res.data;
}
