export interface Match {
  id: number;
  category: string;
  team1: string;
  team2: string;
  dateTime: string;
  court: string;
  status: "SCHEDULED" | "COMPLETED" | "WALKOVER";
  team1_sets_won?: number;
  team2_sets_won?: number;
}

export const mockUpcomingMatches: Match[] = [
  {
    id: 1,
    category: '4ta',
    team1: 'Equipo A',
    team2: 'Equipo B',
    dateTime: '2024-03-20T22:30:00',
    court: 'Cancha 1',
    status: "COMPLETED",
    team1_sets_won: 6,
    team2_sets_won: 4
  },
  {
    id: 2,
    category: '5ta',
    team1: 'Equipo C',
    team2: 'Equipo D',
    dateTime: '2024-03-20T22:30:00',
    court: 'Cancha 2',
    status: "COMPLETED",
    team1_sets_won: 6,
    team2_sets_won: 2
  },
  {
    id: 3,
    category: '6ta',
    team1: 'Equipo E',
    team2: 'Equipo F',
    dateTime: '2024-03-21T22:30:00',
    court: 'Cancha 1',
    status: "SCHEDULED"
  },
  {
    id: 4,
    category: '7ma',
    team1: 'Equipo G',
    team2: 'Equipo H',
    dateTime: '2024-03-21T22:30:00',
    court: 'Cancha 2',
    status: "SCHEDULED"
  },
  {
    id: 5,
    category: '4ta',
    team1: 'Equipo I',
    team2: 'Equipo J',
    dateTime: '2024-03-22T22:30:00',
    court: 'Cancha 1',
    status: "WALKOVER"
  },
  {
    id: 6,
    category: '5ta',
    team1: 'Equipo K',
    team2: 'Equipo L',
    dateTime: '2024-03-22T22:30:00',
    court: 'Cancha 2',
    status: "SCHEDULED"
  },
  {
    id: 7,
    category: '6ta',
    team1: 'Equipo M',
    team2: 'Equipo N',
    dateTime: '2024-03-23T22:30:00',
    court: 'Cancha 1',
    status: "SCHEDULED"
  },
  {
    id: 8,
    category: '7ma',
    team1: 'Equipo O',
    team2: 'Equipo P',
    dateTime: '2024-03-23T22:30:00',
    court: 'Cancha 2',
    status: "SCHEDULED"
  }
]; 