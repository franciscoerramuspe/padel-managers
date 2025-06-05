export interface DashboardStats {
  activeLeagues: number;
  totalTeams: number;
  totalMatches: number;
  completedMatches: number;
}

export const mockStats: DashboardStats = {
  activeLeagues: 4,
  totalTeams: 32,
  totalMatches: 112,
  completedMatches: 28
}; 