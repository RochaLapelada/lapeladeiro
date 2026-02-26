import { Player, Match } from "./types";

const PLAYERS_KEY = "peladeiros_players_v2";
const MATCHES_KEY = "peladeiros_matches";

const defaultPlayers: Player[] = [
  { id: "1", name: "Diego Nascimento", rating: 3, position: "Linha", positions: ["PD", "CA"], status: "active", goals: 12, ownGoals: 0, yellowCards: 1, redCards: 0, matches: 45, wins: 16, losses: 10, draws: 5 },
  { id: "2", name: "Anderson Pinheiro", rating: 2, position: "Linha", positions: ["MO", "MD"], status: "active", goals: 8, ownGoals: 1, yellowCards: 2, redCards: 1, matches: 40, wins: 10, losses: 15, draws: 5 },
  { id: "3", name: "Aennson", rating: 3, position: "Linha", positions: ["ZG"], status: "active", goals: 3, ownGoals: 0, yellowCards: 0, redCards: 0, matches: 85, wins: 16, losses: 8, draws: 6 },
  { id: "4", name: "Eduardo Borges", rating: 3, position: "Goleiro", positions: ["GL"], status: "active", goals: 0, ownGoals: 0, yellowCards: 0, redCards: 0, matches: 35, wins: 12, losses: 8, draws: 5 },
  { id: "5", name: "Carlinhos", rating: 3, position: "Linha", positions: ["MD", "MO"], status: "active", goals: 15, ownGoals: 0, yellowCards: 1, redCards: 0, matches: 50, wins: 14, losses: 12, draws: 8 },
  { id: "6", name: "Bruno", rating: 2, position: "Linha", positions: ["VOL", "MD"], status: "active", goals: 5, ownGoals: 0, yellowCards: 3, redCards: 0, matches: 30, wins: 8, losses: 10, draws: 4 },
  { id: "7", name: "Alberto Melo", rating: 2, position: "Linha", positions: ["LE", "ZG", "LD"], status: "active", goals: 2, ownGoals: 0, yellowCards: 1, redCards: 0, matches: 28, wins: 9, losses: 7, draws: 4 },
  { id: "8", name: "Isaac F. Martins", rating: 2, position: "Linha", positions: ["VOL"], status: "active", goals: 4, ownGoals: 0, yellowCards: 2, redCards: 0, matches: 22, wins: 6, losses: 8, draws: 3 },
  { id: "9", name: "Celso Moreira", rating: 3, position: "Linha", positions: ["ATA"], status: "active", goals: 20, ownGoals: 0, yellowCards: 0, redCards: 0, matches: 38, wins: 13, losses: 10, draws: 5 },
  { id: "10", name: "Alex", rating: 2, position: "Linha", positions: ["SA"], status: "active", goals: 7, ownGoals: 0, yellowCards: 1, redCards: 0, matches: 25, wins: 7, losses: 9, draws: 3 },
  { id: "11", name: "Roberto Carlos", rating: 3, position: "Goleiro", positions: ["GL"], status: "active", goals: 0, ownGoals: 0, yellowCards: 0, redCards: 0, matches: 42, wins: 18, losses: 10, draws: 6 },
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

export function addPlayer(player: Omit<Player, "id" | "goals" | "ownGoals" | "yellowCards" | "redCards" | "matches" | "wins" | "losses" | "draws">): Player {
  const players = getPlayers();
  const newPlayer: Player = {
    ...player,
    id: Date.now().toString(),
    goals: 0, ownGoals: 0, yellowCards: 0, redCards: 0, matches: 0, wins: 0, losses: 0, draws: 0,
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

  // Separate goalkeepers and field players
  const goalkeepers = players.filter(p => p.position === "Goleiro");
  const fieldPlayers = players.filter(p => p.position === "Linha");

  if (mode === "rating") {
    fieldPlayers.sort((a, b) => b.rating - a.rating);
  } else if (mode === "position") {
    fieldPlayers.sort((a, b) => a.positions[0].localeCompare(b.positions[0]));
  } else {
    fieldPlayers.sort(() => Math.random() - 0.5);
    goalkeepers.sort(() => Math.random() - 0.5);
  }

  const team1: string[] = [];
  const team2: string[] = [];

  // Distribute goalkeepers first
  goalkeepers.forEach((p, i) => {
    if (i % 2 === 0) team1.push(p.id);
    else team2.push(p.id);
  });

  // Then field players
  fieldPlayers.forEach((p, i) => {
    if (i % 2 === 0) team1.push(p.id);
    else team2.push(p.id);
  });

  return [team1, team2];
}
