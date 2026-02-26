export interface Player {
  id: string;
  name: string;
  rating: number; // 1-5 stars
  positions: string[];
  status: "active" | "inactive";
  goals: number;
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
  type: "goal" | "yellow_card" | "red_card" | "substitution";
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
  duration: number; // seconds
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
