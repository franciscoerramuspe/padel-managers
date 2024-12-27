import db from '../../config/database.js';
import { randomUUID } from 'crypto';

export class TournamentDrawService {
  constructor(db) {
    this.db = db;
  }

  async getDraw(tournamentId) {
    try {
      const { data: matches, error } = await this.db
        .from('tournament_matches')
        .select(`
          *,
          team1:team1_id(id, name),
          team2:team2_id(id, name),
          court:court_id(id, name)
        `)
        .eq('tournament_id', tournamentId)
        .order('round', { ascending: true })
        .order('position', { ascending: true });

      if (error) throw error;

      const formattedMatches = matches.map(match => ({
        id: match.id,
        team1: match.team1,
        team2: match.team2,
        status: match.status || 'pending',
        team1_score: match.team1_score || null,
        team2_score: match.team2_score || null,
        winner_id: match.winner_id,
        scheduled_start: match.scheduled_start,
        scheduled_end: match.scheduled_end,
        court: match.court,
        round: match.round,
        position: match.position
      }));

      const { data: tournament, error: tournamentError } = await this.db
        .from('tournaments')
        .select(`
          *,
          tournament_teams!inner(
            team:team_id(
              id,
              name
            )
          )
        `)
        .eq('id', tournamentId)
        .single();

      if (tournamentError) throw tournamentError;

      return { 
        data: {
          matches: formattedMatches, 
          tournament: tournament
        }
      };
    } catch (error) {
      console.error('Error in getDraw:', error);
      return { error: 'Failed to get tournament draw' };
    }
  }

  async updateMatchScore(matchId, scoreData) {
    try {
      const { team1_score, team2_score, winner_id, status } = scoreData;

      // First verify the match exists
      const { data: existingMatch, error: fetchError } = await this.db
        .from('tournament_matches')
        .select('*')
        .eq('id', matchId)
        .single();

      if (fetchError) throw fetchError;
      if (!existingMatch) throw new Error('Match not found');

      console.log('Updating match:', matchId, 'with scores:', { team1_score, team2_score });

      // Update the match with new scores
      const { data: updatedMatch, error: updateError } = await this.db
        .from('tournament_matches')
        .update({
          team1_score,
          team2_score,
          winner_id,
          status: 'completed'
        })
        .eq('id', matchId)
        .select()
        .single();

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      if (!updatedMatch) {
        throw new Error('Failed to update match');
      }

      // Get the full match details with relations
      const { data: match, error: getError } = await this.db
        .from('tournament_matches')
        .select(`
          *,
          team1:team1_id(id, name),
          team2:team2_id(id, name),
          court:court_id(id, name)
        `)
        .eq('id', matchId)
        .single();

      if (getError) throw getError;

      return { 
        data: {
          id: match.id,
          team1: match.team1,
          team2: match.team2,
          status: 'completed',
          team1_score,
          team2_score,
          winner_id,
          scheduled_start: match.scheduled_start,
          scheduled_end: match.scheduled_end,
          court: match.court,
          round: match.round,
          position: match.position
        }
      };
    } catch (error) {
      console.error('Error updating match score:', error);
      return { error: error.message || 'Failed to update match score' };
    }
  }

  async getMatchDetails(matchId) {
    try {
      const { data: match, error } = await this.db
        .from('tournament_matches')
        .select(`
          *,
          team1:team1_id(id, name),
          team2:team2_id(id, name),
          court:court_id(id, name)
        `)
        .eq('id', matchId)
        .single();

      if (error) throw error;

      return {
        data: {
          ...match,
          status: match.status || 'pending',
          team1_score: match.team1_score || null,
          team2_score: match.team2_score || null
        }
      };
    } catch (error) {
      console.error('Error getting match details:', error);
      return { error: 'Failed to get match details' };
    }
  }

  async updateMatchDetails(matchId, updateData) {
    try {
      const { court, scheduledTime, scoreTeam1, scoreTeam2, team1Id, team2Id } = updateData;

      const updates = {};

      // Only include fields that are provided
      if (court) updates.court_id = court;
      if (scheduledTime) {
        updates.scheduled_start = scheduledTime;
        updates.scheduled_end = new Date(new Date(scheduledTime).getTime() + 60 * 60 * 1000); // 1 hour duration
      }
      if (scoreTeam1 !== undefined) updates.team1_score = scoreTeam1;
      if (scoreTeam2 !== undefined) updates.team2_score = scoreTeam2;
      if (team1Id) updates.team1_id = team1Id;
      if (team2Id) updates.team2_id = team2Id;

      const { data: match, error } = await this.db
        .from('tournament_matches')
        .update(updates)
        .eq('id', matchId)
        .select(`
          *,
          team1:team1_id(id, name),
          team2:team2_id(id, name),
          court:court_id(id, name)
        `)
        .single();

      if (error) throw error;

      return { 
        data: {
          ...match,
          status: match.status || 'pending',
          team1_score: match.team1_score || null,
          team2_score: match.team2_score || null
        }
      };
    } catch (error) {
      console.error('Error updating match details:', error);
      return { error: 'Failed to update match details' };
    }
  }

  // ... rest of your existing methods ...
}

// Create and export the instance
export const tournamentDrawService = new TournamentDrawService(db);
