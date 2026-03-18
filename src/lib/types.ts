export type PlayerPosition = "Goleiro" | "Linha";

export const FIELD_SKILL_CRITERIA = [
  { id: "shooting", label: "Chuta bem", icon: "🎯" },
  { id: "scoring", label: "Faz bastante gol", icon: "⚽" },
  { id: "defending", label: "Ajuda na marcação", icon: "🛡️" },
  { id: "teamwork", label: "Joga em equipe", icon: "🤝" },
  { id: "clutch", label: "Resolve a partida", icon: "🔥" },
] as const;

export const GOALKEEPER_SKILL_CRITERIA = [
  { id: "gk_best", label: "É o melhor jogador do time?", icon: "👑" },
  { id: "gk_saves", label: "Faz defesas difíceis?", icon: "🧤" },
  { id: "gk_no_blunder", label: "Não toma frango?", icon: "🚫" },
  { id: "gk_feet", label: "Sabe trabalhar com os pés?", icon: "👟" },
  { id: "gk_launch", label: "Faz lançamentos para ataque?", icon: "🚀" },
] as const;

export const SKILL_CRITERIA = FIELD_SKILL_CRITERIA;

export type SkillId = typeof SKILL_CRITERIA[number]["id"];

export interface Player {
  id: string;
  name: string;
  rating: number; // 0-5 based on skills count
  skills: SkillId[]; // which criteria the player meets
  position: PlayerPosition;
  positions: string[];
  status: "active" | "inactive";
  star: boolean;
  goals: number;
  ownGoals: number;
  yellowCards: number;
  redCards: number;
  matches: number;
  wins: number;
  losses: number;
  draws: number;
  avatar?: string;
}

export interface MatchEvent {
  id: string;
  type: "goal" | "own_goal" | "yellow_card" | "red_card" | "substitution" | "removed" | "quit";
  playerId: string;
  team: "home" | "away";
  minute: number;
  assistPlayerId?: string;
}

export interface Match {
  id: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  homePlayers: string[];
  awayPlayers: string[];
  events: MatchEvent[];
  status: "pending" | "in_progress" | "finished";
  duration: number;
}

export interface Team {
  id: string;
  name: string;
  color: string;
  players: string[];
  wins: number;
  losses: number;
  draws: number;
}
