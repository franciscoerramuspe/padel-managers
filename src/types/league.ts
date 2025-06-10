export interface League {
  id: string;
  name: string;
  category_id: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  start_date: string;
  end_date: string;
  courts_available: number;
  time_slots: number[][];
  inscription_cost: number;
  description: string | null;
  frequency: string;
  match_duration_minutes: number;
  points_for_win: number;
  points_for_loss_with_set: number;
  points_for_loss: number;
  points_for_walkover: number;
  status: string | null;
  team_size: number | null;
}

export interface LeagueTeam {
  id: string;
  name: string;
  players: string[];
  stats: {
    played: number;    // PJ
    won: number;       // PG
    lost: number;      // PP
    setsWon: number;   // SG
    setsLost: number;  // SP
    points: number;    // PTS
  };
}

export interface LeagueMatch {
  id: string;
  league_id: string;
  league_team1_id: string;
  league_team2_id: string;
  team1: string;
  team2: string;
  match_date: string;
  match_number: number;
  team1_sets_won: number;
  team2_sets_won: number;
  winner_league_team_id: string | null;
  status: 'SCHEDULED' | 'COMPLETED' | 'WALKOVER';
  walkover: boolean;
  walkover_team_id: string | null;
  category_id: string;
  score?: {
    set1: {
      team1: number;
      team2: number;
      tiebreak?: {
        team1: number;
        team2: number;
      };
    };
    set2: {
      team1: number;
      team2: number;
      tiebreak?: {
        team1: number;
        team2: number;
      };
    };
    superTiebreak?: {
      team1: number;
      team2: number;
    };
  };
} 