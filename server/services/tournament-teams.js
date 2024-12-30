import db from '../config/database.js';

export class TournamentTeamsService {
  constructor(db) {
    this.db = db;
  }

  async registerTeam(tournamentId, team) {
    try {
      // First check if tournament exists and has space
      const { data: tournament, error: tournamentError } = await this.db
        .from('tournaments')
        .select(`
          *,
          tournament_teams (
            team:teams (*)
          )
        `)
        .eq('id', tournamentId)
        .single();

      if (tournamentError) throw tournamentError;

      if (!tournament) {
        return { error: 'Tournament not found' };
      }

      // Log for debugging
      console.log('Current teams:', tournament.tournament_teams?.length);
      console.log('Teams limit:', tournament.teams_limit);

      // Check if tournament is full
      if (tournament.tournament_teams && tournament.tournament_teams.length >= tournament.teams_limit) {
        return { error: 'Tournament is full' };
      }

      // Insert the team
      const { data: teamData, error: teamError } = await this.db
        .from('teams')
        .insert({
          id: team.id,
          name: team.name
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // Insert the players
      const playersPromises = team.players.map(player => 
        this.db
          .from('players')
          .insert({
            id: player.id,
            name: player.name
          })
          .select()
      );

      await Promise.all(playersPromises);

      // Link team to tournament
      const { error: linkError } = await this.db
        .from('tournament_teams')
        .insert({
          tournament_id: tournamentId,
          team_id: team.id
        });

      if (linkError) throw linkError;

      // Link players to team
      const teamPlayersPromises = team.players.map(player =>
        this.db
          .from('team_players')
          .insert({
            team_id: team.id,
            player_id: player.id
          })
      );

      await Promise.all(teamPlayersPromises);

      return { data: teamData };
    } catch (error) {
      console.error('Error in registerTeam:', error);
      return { error: 'Failed to register team' };
    }
  }
} 