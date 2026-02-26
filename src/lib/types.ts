export type PlayerPosition = "Goleiro" | "Linha";

export interface Player {
  id: string;
  name: string;
  rating: number; // 1-3 stars
  position: PlayerPosition;
  positions: string[]; // detailed positions like ZG, VOL, etc.
  status: "active" | "inactive";
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
