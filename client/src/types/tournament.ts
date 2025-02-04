import { UUID } from 'crypto';

export interface Player {
  id: UUID;
  name: string;
}

export interface Team {
  id: UUID;
  player1: Player;
  player2: Player;
}

export interface TimeConstraint {
  team_id: UUID;
  start_time: Date;
  end_time: Date;
}

export type TournamentFormat =
  | 'single_elimination'
  | 'round_robin'
  | 'group_stage';

export interface CreateTournamentRequest {
  name: string;
  players: Player[];
  teams: Team[];
  teams_limit: number;
  category: string;
  start_date: Date;
  end_date: Date;
  price: number;
  sign_up_limit_date: Date;
  format: TournamentFormat;
  time_constraints?: TimeConstraint[];
}

export interface TournamentTimeConstraint {
  id: UUID;
  tournament_id: UUID;
  team_id: UUID;
  start_time: Date;
  end_time: Date;
}

export interface TournamentTeam extends Team {
  team_id: string;
  group?: 'A' | 'B';
  teams?: {
    id: string;
    player1_id: string;
    player2_id: string;
  };
}

export interface TournamentInfo {
  id: string;
  description: string;
  inscription_cost: number;
  tournament_location: string;
  tournament_club_name: string;
  tournament_thumbnail?: string;
  rules?: string;
  tournament_address?: string;
  signup_limit_date?: string;
  first_place_prize?: string;
  second_place_prize?: string;
  third_place_prize?: string;
}

export interface Tournament {
  id: string;
  name: string;
  status: 'upcoming' | 'in_progress' | 'completed';
  start_date: string;
  end_date: string;
  category_id: string;
  teams_limit: number;
  price?: number;
  prize_pool?: number;
  format: TournamentFormat;
  tournament_teams: TournamentTeam[];
  tournament_info: TournamentInfo[];
}

export interface Category {
  id: string;
  name: string;
}

interface Set {
  games: number;
  tiebreak: number | null;
}

interface Score {
  sets: Set[];
}

interface Match {
  id: string;
  team1: {
    id: string;
    name: string;
  } | null;
  team2: {
    id: string;
    name: string;
  } | null;
  status: 'pending' | 'completed';
  team1_score: Score | null;
  team2_score: Score | null;
  winner_id: string | null;
  scheduled_start?: string;
  scheduled_end?: string;
  court?: {
    id: string;
    name: string;
  };
  round: number;
  position: number;
}

interface TournamentDraw {
  matches: Match[];
}
