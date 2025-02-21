import { League, LeagueTeam, LeagueMatch } from '@/types/league';

export const mockLeagues: League[] = [
  {
    id: '1',
    name: 'Liga Nocturna 4ta',
    category: '4ta',
    status: 'upcoming',
    start_date: '2025-04-01',
    teams_count: 6,
    max_teams: 8,
    schedule: '22:30 - 00:00',
    frequency: 'Quincenal',
    time_slots: ['22:30', '23:15', '00:00'],
    days_of_week: ['Lunes']
  },
  {
    id: '2',
    name: 'Liga Nocturna 5ta',
    category: '5ta',
    status: 'upcoming',
    start_date: '2025-04-02',
    teams_count: 8,
    max_teams: 8,
    schedule: '22:30 - 00:00',
    frequency: 'Quincenal',
    time_slots: ['22:30', '23:15', '00:00'],
    days_of_week: ['Martes']
  },
  {
    id: '3',
    name: 'Liga Nocturna 6ta',
    category: '6ta',
    status: 'in_progress',
    start_date: '2025-04-03',
    teams_count: 8,
    max_teams: 8,
    schedule: '22:30 - 00:00',
    frequency: 'Quincenal',
    time_slots: ['22:30', '23:15', '00:00'],
    days_of_week: ['Miércoles']
  }
];

export const mockTeams: LeagueTeam[] = [
  {
    id: 't1',
    name: 'Equipo 1',
    players: ['Juan Pérez', 'Pedro González'],
    stats: {
      played: 4,
      won: 3,
      lost: 1,
      setsWon: 7,
      setsLost: 3,
      points: 7
    }
  },
  {
    id: 't2',
    name: 'Equipo 2',
    players: ['Juan Pérez', 'Pedro González'],
    stats: {
      played: 4,
      won: 3,
      lost: 1,
      setsWon: 7,
      setsLost: 3,
      points: 7
    }
  },

];

export const mockMatches: LeagueMatch[] = [
  {
    id: 'm1',
    team1: 'Equipo 1',
    team2: 'Equipo 2',
    date: '2025-04-01',
    time: '22:30',
    round: 1,
    score: null,
    status: 'pending'
  },
  {
    id: 'm2',
    team1: 'Equipo 3',
    team2: 'Equipo 4',
    date: '2025-04-01',
    time: '22:30',
    round: 1,
    score: null,
    status: 'pending'
  },
]; 