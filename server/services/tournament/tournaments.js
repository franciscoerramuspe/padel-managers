import db from '../../config/database.js';
import { randomUUID } from 'crypto';

// Valid tournament formats based on the database constraint
const VALID_FORMATS = ['single_elimination', 'double_elimination', 'round_robin', 'group_stage'];

export const tournamentService = {
  async getTournaments(filters = {}) {
    try {
      let query = db.from('tournaments').select(`
        *,
        tournament_time_constraints (*)
      `);

      if (filters.startDate) {
        query = query.gte('start_date', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('end_date', filters.endDate);
      }

      const { data, error } = await query.order('start_date', { ascending: true });

      if (error) throw error;
      return { data };
    } catch (error) {
      console.error('Error in getTournaments:', error);
      return { error: 'Failed to fetch tournaments' };
    }
  },

  async createTournament(tournamentData) {
    try {
      // Start a transaction
      const { data: tournament, error: tournamentError } = await db
        .from('tournaments')
        .insert([{
          id: randomUUID(),
          name: tournamentData.name,
          teams_limit: tournamentData.teams_limit,
          category: tournamentData.category,
          start_date: tournamentData.start_date,
          end_date: tournamentData.end_date,
          price: tournamentData.price,
          sign_up_limit_date: tournamentData.sign_up_limit_date,
          format: tournamentData.format,
          status: tournamentData.status || 'open',
          players: tournamentData.players || [],
          teams: tournamentData.teams || [],
          current_registrations: 0
        }])
        .select()
        .single();

      if (tournamentError) throw tournamentError;

      // Insert teams if provided
      if (tournamentData.teams && tournamentData.teams.length > 0) {
        // First insert teams
        const { error: teamsError } = await db
          .from('teams')
          .upsert(
            tournamentData.teams.map(team => ({
              id: team.id,
              name: team.name
            })),
            { onConflict: 'id' }
          );

        if (teamsError) throw teamsError;

        // Then create tournament-team relationships
        const { error: relationError } = await db
          .from('tournament_teams')
          .insert(
            tournamentData.teams.map(team => ({
              tournament_id: tournament.id,
              team_id: team.id
            }))
          );

        if (relationError) throw relationError;
      }

      // Return the created tournament with teams
      const { data: fullTournament, error: fetchError } = await db
        .from('tournaments')
        .select(`
          *,
          tournament_teams (
            teams:team_id (
              id,
              name
            )
          )
        `)
        .eq('id', tournament.id)
        .single();

      if (fetchError) throw fetchError;

      return { data: fullTournament };
    } catch (error) {
      console.error('Error in createTournament:', error);
      return { error: 'Failed to create tournament' };
    }
  },

  async getTournamentById(id) {
    try {
      const { data: tournament, error } = await db
        .from('tournaments')
        .select(`
          *,
          tournament_teams (
            team:team_id (
              id,
              name
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Database error:', error);
        if (error.code === 'PGRST116') {
          return { error: 'Tournament not found' };
        }
        throw error;
      }

      return { data: tournament };
    } catch (error) {
      console.error('Error fetching tournament:', error);
      return { error: 'Failed to fetch tournament' };
    }
  },

  async updateTournament(id, updates) {
    try {
      console.log('Updating tournament with data:', updates);

      const { data: tournament, error } = await db
        .from('tournaments')
        .update({
          name: updates.name,
          start_date: updates.start_date,
          end_date: updates.end_date,
          teams_limit: updates.teams_limit,
          price: updates.price,
          location: updates.location,
          format: updates.format,
          status: updates.status,
          prize_pool: updates.prize_pool,
          category: updates.category,
          sign_up_limit_date: updates.sign_up_limit_date,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        if (error.code === 'PGRST116') {
          return { error: 'Tournament not found' };
        }
        throw error;
      }

      console.log('Tournament updated successfully:', tournament);
      return { data: tournament };
    } catch (error) {
      console.error('Error updating tournament:', error);
      return { error: 'Failed to update tournament' };
    }
  }
};