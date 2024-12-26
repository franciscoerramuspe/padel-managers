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
  group?: 'A' | 'B';
}

export interface Tournament {
  id: string;
  name: string;
  teams: TournamentTeam[];
  format: 'single_elimination' | 'round_robin' | 'group_stage';
}
