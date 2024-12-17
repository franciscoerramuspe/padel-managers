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
  time_constraints?: TimeConstraint[];
}

export interface TournamentTimeConstraint {
  id: UUID;
  tournament_id: UUID;
  team_id: UUID;
  start_time: Date;
  end_time: Date;
}
