export interface League {
  id: string;
  name: string;
  category: string;
  status: 'upcoming' | 'in_progress' | 'finished';
  start_date: string;
  teams_count: number;
  max_teams: number;
  schedule: string;
  frequency: string;
  time_slots: string[];
  days_of_week: string[];
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