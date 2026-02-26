import { Player, Match, Team } from "./types";

const PLAYERS_KEY = "peladeiros_players";
const MATCHES_KEY = "peladeiros_matches";

const defaultPlayers: Player[] = [
  { id: "1", name: "Diego Nascimento", rating: 3, positions: ["PD", "CA"], status: "active", goals: 12, yellowCards: 1, redCards: 0, matches: 45, wins: 16, losses: 10, draws: 5 },
  { id: "2", name: "Anderson Pinheiro", rating: 2, positions: ["MO", "MD"], status: "active", goals: 8, yellowCards: 2, redCards: 1, matches: 40, wins: 10, losses: 15, draws: 5 },
  { id: "3", name: "Aennson", rating: 3, positions: ["ZG"], status: "active", goals: 3, yellowCards: 0, redCards: 0, matches: 85, wins: 16, losses: 8, draws: 6 },
  { id: "4", name: "Eduardo Borges", rating: 3, positions: ["GL"], status: "active", goals: 0, yellowCards: 0, redCards: 0, matches: 35, wins: 12, losses: 8, draws: 5 },
  { id: "5", name: "Carlinhos", rating: 3, positions: ["MD", "MO"], status: "active", goals: 15, yellowCards: 1, redCards: 0, matches: 50, wins: 14, losses: 12, draws: 8 },
  { id: "6", name: "Bruno", rating: 2, positions: ["VOL", "MD"], status: "active", goals: 5, yellowCards: 3, redCards: 0, matches: 30, wins: 8, losses: 10, draws: 4 },
  { id: "7", name: "Alberto Melo", rating: 2, positions: ["LE", "ZG", "LD"], status: "active", goals: 2, yellowCards: 1, redCards: 0, matches: 28, wins: 9, losses: 7, draws: 4 },
  { id: "8", name: "Isaac F. Martins", rating: 2, positions: ["VOL"], status: "active", goals: 4, yellowCards: 2, redCards: 0, matches: 22, wins: 6, losses: 8, draws: 3 },
  { id: "9", name: "Celso Moreira", rating: 3, positions: ["ATA"], status: "active", goals: 20, yellowCards: 0, redCards: 0, matches: 38, wins: 13, losses: 10, draws: 5 },
  { id: "10", name: "Alex", rating: 2, positions: ["SA"], status: "active", goals: 7, yellowCards: 1, redCards: 0, matches: 25, wins: 7, losses: 9, draws: 3 },
];

export function getPlayers(): Player[] {
  const stored = localStorage.getItem(PLAYERS_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(defaultPlayers));
  return defaultPlayers;
}

export function savePlayers(players: Player[]) {
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
}

export function addPlayer(player: Omit<Player, "id" | "goals" | "yellowCards" | "redCards" | "matches" | "wins" | "losses" | "draws">): Player {
  const players = getPlayers();
  const newPlayer: Player = {
    ...player,
    id: Date.now().toString(),
    goals: 0, yellowCards: 0, redCards: 0, matches: 0, wins: 0, losses: 0, draws: 0,
  };
  players.push(newPlayer);
  savePlayers(players);
  return newPlayer;
}

export function deletePlayer(id: string) {
  const players = getPlayers().filter(p => p.id !== id);
  savePlayers(players);
}

export function getMatches(): Match[] {
  const stored = localStorage.getItem(MATCHES_KEY);
  if (stored) return JSON.parse(stored);
  return [];
}

export function saveMatch(match: Match) {
  const matches = getMatches();
  matches.push(match);
  localStorage.setItem(MATCHES_KEY, JSON.stringify(matches));
}

export function sortTeams(playerIds: string[], mode: "random" | "position" | "rating"): [string[], string[]] {
  const players = getPlayers().filter(p => playerIds.includes(p.id));
  
  if (mode === "rating") {
    players.sort((a, b) => b.rating - a.rating);
  } else if (mode === "position") {
    players.sort((a, b) => a.positions[0].localeCompare(b.positions[0]));
  } else {
    players.sort(() => Math.random() - 0.5);
  }

  const team1: string[] = [];
  const team2: string[] = [];
  
  players.forEach((p, i) => {
    if (i % 2 === 0) team1.push(p.id);
    else team2.push(p.id);
  });

  return [team1, team2];
}
