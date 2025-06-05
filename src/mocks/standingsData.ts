export interface TeamStanding {
  position: number;
  name: string;
  played: number;
  won: number;
  lost: number;
  setsWon: number;
  setsLost: number;
  setsDiff: number;
  points: number;
}

export type CategoryStandings = {
  [key: string]: TeamStanding[];
};

export const mockStandings: CategoryStandings = {
  '4ta': [
    { position: 1, name: 'Equipo A', played: 7, won: 6, lost: 1, setsWon: 12, setsLost: 3, setsDiff: 9, points: 13 },
    { position: 2, name: 'Equipo B', played: 7, won: 5, lost: 2, setsWon: 11, setsLost: 5, setsDiff: 6, points: 11 },
    { position: 3, name: 'Equipo I', played: 7, won: 4, lost: 3, setsWon: 10, setsLost: 7, setsDiff: 3, points: 9 },
    { position: 4, name: 'Equipo J', played: 7, won: 4, lost: 3, setsWon: 9, setsLost: 8, setsDiff: 1, points: 9 },
    { position: 5, name: 'Equipo Q', played: 7, won: 3, lost: 4, setsWon: 8, setsLost: 9, setsDiff: -1, points: 7 },
    { position: 6, name: 'Equipo R', played: 7, won: 2, lost: 5, setsWon: 6, setsLost: 11, setsDiff: -5, points: 5 },
    { position: 7, name: 'Equipo Y', played: 7, won: 2, lost: 5, setsWon: 5, setsLost: 12, setsDiff: -7, points: 4 },
    { position: 8, name: 'Equipo Z', played: 7, won: 1, lost: 6, setsWon: 4, setsLost: 13, setsDiff: -9, points: 2 }
  ],
  '5ta': [
    { position: 1, name: 'Equipo C', played: 7, won: 7, lost: 0, setsWon: 14, setsLost: 2, setsDiff: 12, points: 14 },
    { position: 2, name: 'Equipo D', played: 7, won: 4, lost: 3, setsWon: 9, setsLost: 7, setsDiff: 2, points: 9 },
    { position: 3, name: 'Equipo K', played: 7, won: 4, lost: 3, setsWon: 9, setsLost: 8, setsDiff: 1, points: 9 },
    { position: 4, name: 'Equipo L', played: 7, won: 4, lost: 3, setsWon: 8, setsLost: 8, setsDiff: 0, points: 8 },
    { position: 5, name: 'Equipo S', played: 7, won: 3, lost: 4, setsWon: 7, setsLost: 9, setsDiff: -2, points: 6 },
    { position: 6, name: 'Equipo T', played: 7, won: 2, lost: 5, setsWon: 6, setsLost: 10, setsDiff: -4, points: 5 },
    { position: 7, name: 'Equipo AA', played: 7, won: 2, lost: 5, setsWon: 5, setsLost: 11, setsDiff: -6, points: 4 },
    { position: 8, name: 'Equipo BB', played: 7, won: 1, lost: 6, setsWon: 4, setsLost: 12, setsDiff: -8, points: 2 }
  ],
  '6ta': [
    { position: 1, name: 'Equipo E', played: 7, won: 6, lost: 1, setsWon: 13, setsLost: 4, setsDiff: 9, points: 13 },
    { position: 2, name: 'Equipo F', played: 7, won: 5, lost: 2, setsWon: 12, setsLost: 6, setsDiff: 6, points: 11 },
    { position: 3, name: 'Equipo M', played: 7, won: 5, lost: 2, setsWon: 11, setsLost: 6, setsDiff: 5, points: 11 },
    { position: 4, name: 'Equipo N', played: 7, won: 4, lost: 3, setsWon: 9, setsLost: 8, setsDiff: 1, points: 9 },
    { position: 5, name: 'Equipo U', played: 7, won: 3, lost: 4, setsWon: 8, setsLost: 9, setsDiff: -1, points: 7 },
    { position: 6, name: 'Equipo V', played: 7, won: 2, lost: 5, setsWon: 6, setsLost: 11, setsDiff: -5, points: 4 },
    { position: 7, name: 'Equipo CC', played: 7, won: 2, lost: 5, setsWon: 5, setsLost: 12, setsDiff: -7, points: 4 },
    { position: 8, name: 'Equipo DD', played: 7, won: 1, lost: 6, setsWon: 4, setsLost: 13, setsDiff: -9, points: 2 }
  ],
  '7ma': [
    { position: 1, name: 'Equipo G', played: 7, won: 7, lost: 0, setsWon: 14, setsLost: 2, setsDiff: 12, points: 14 },
    { position: 2, name: 'Equipo H', played: 7, won: 4, lost: 3, setsWon: 10, setsLost: 8, setsDiff: 2, points: 9 },
    { position: 3, name: 'Equipo O', played: 7, won: 4, lost: 3, setsWon: 9, setsLost: 8, setsDiff: 1, points: 9 },
    { position: 4, name: 'Equipo P', played: 7, won: 4, lost: 3, setsWon: 9, setsLost: 8, setsDiff: 1, points: 9 },
    { position: 5, name: 'Equipo W', played: 7, won: 3, lost: 4, setsWon: 8, setsLost: 9, setsDiff: -1, points: 7 },
    { position: 6, name: 'Equipo X', played: 7, won: 2, lost: 5, setsWon: 6, setsLost: 11, setsDiff: -5, points: 4 },
    { position: 7, name: 'Equipo EE', played: 7, won: 2, lost: 5, setsWon: 5, setsLost: 12, setsDiff: -7, points: 4 },
    { position: 8, name: 'Equipo FF', played: 7, won: 1, lost: 6, setsWon: 4, setsLost: 13, setsDiff: -9, points: 2 }
  ]
}; 