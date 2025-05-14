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
  team1: string;
  team2: string;
  date: string;
  time: string;
  round: number;
  score: {
    team1Sets: number;
    team2Sets: number;
  } | null;
  status: 'pending' | 'completed' | 'walkover';
} 