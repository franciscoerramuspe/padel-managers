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

export interface TimeSlot {
  start: string;
  end: string;
}

export interface TournamentInfo {
  time_slots: TimeSlot[];
  courts_available: string[];
  description: string;
  rules: string;
  tournament_location: string;
  tournament_address: string;
  tournament_club_name: string;
  signup_limit_date: string;
  inscription_cost: number;
  first_place_prize: string;
  second_place_prize: string;
  third_place_prize: string;
}

export interface Tournament {
  id: string;
  name: string;
  category_id: string;
  status: 'upcoming' | 'in_progress' | 'finished';
  start_date: string;
  end_date: string;
  teams_limit: number;
  price?: number;
  prize_pool?: number;
  format: TournamentFormat;
  tournament_teams: TournamentTeam[];
  tournament_info: Array<{
    tournament_club_name?: string;
    inscription_cost?: number;
  }>;
  created_at?: string;
  updated_at?: string;
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

export interface Match {
  id: string;
  tournament_id: string;
  home_team_id?: string;
  away_team_id?: string;
  court_id?: string;
  score?: string;
  created_at: Date;
  updated_at: Date;
  status: string;
  start_hour: string;
  match_day: Date;
  round_number: number;
  winner_team_id?: string;
  round: number;
  start_time: string;
  home_team?: {
    id: string;
    player1_id: string;
    player2_id: string;
    player1: {
      first_name: string;
      last_name: string;
    };
    player2: {
      first_name: string;
      last_name: string;
    };
  };
  away_team?: {
    id: string;
    player1_id: string;
    player2_id: string;
    player1: {
      first_name: string;
      last_name: string;
    };
    player2: {
      first_name: string;
      last_name: string;
    };
  };
  nextMatchId?: string;
}

interface TournamentDraw {
  matches: Match[];
}

export interface FormData {
  name: string;
  category_ids: string[];
  start_date: string;
  end_date: string;
  status: string;
}
