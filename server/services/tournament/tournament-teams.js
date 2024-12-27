class TournamentTeamsService {
  constructor(db) {
    this.db = db;
  }

  async registerTeams(tournamentId, teams) {
    try {
      const tournamentTeams = teams.map(team => ({
        tournament_id: tournamentId,
        team_id: team.id
      }));

      const { data, error } = await this.db
        .from('tournament_teams')
        .insert(tournamentTeams)
        .select();

      if (error) throw error;

      return { data };
    } catch (error) {
      console.error('Error registering teams:', error);
      return { error: 'Failed to register teams' };
    }
  }
}

module.exports = TournamentTeamsService; 