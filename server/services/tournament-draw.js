import db from '../config/database.js';
import { randomUUID } from 'crypto';

export const tournamentDrawService = {
  async createDraw(tournamentId) {
    try {
      // 1. Get tournament teams through the junction table
      const { data: tournamentTeams, error: teamsError } = await db
        .from('tournament_teams')
        .select('team_id')
        .eq('tournament_id', tournamentId);

      if (teamsError) throw teamsError;

      if (!tournamentTeams || tournamentTeams.length < 2) {
        return { error: 'Not enough teams to create a draw' };
      }

      const teamIds = tournamentTeams.map(tt => tt.team_id);

      // 2. Get team details
      const { data: teams, error: teamDetailsError } = await db
        .from('teams')
        .select('*')
        .in('id', teamIds);

      if (teamDetailsError) throw teamDetailsError;

      // 3. Create matches
      const matches = generateMatchStructure(tournamentId, teams);

      // 4. Insert matches
      const { error: matchesError } = await db
        .from('tournament_matches')
        .insert(matches);

      if (matchesError) throw matchesError;

      return { data: matches };
    } catch (error) {
      console.error('Error in createDraw:', error);
      return { error: 'Failed to create tournament draw' };
    }
  },

  async getDraw(tournamentId) {
    try {
      // Get tournament matches
      const { data: matches, error: matchesError } = await db
        .from('tournament_matches')
        .select(`
          *,
          team1:team1_id(id, name),
          team2:team2_id(id, name),
          winner:winner_id(id, name)
        `)
        .eq('tournament_id', tournamentId)
        .order('round', { ascending: true })
        .order('position', { ascending: true });

      if (matchesError) throw matchesError;

      return { data: { matches: matches || [] } };
    } catch (error) {
      console.error('Error in getDraw:', error);
      return { error: 'Failed to fetch tournament draw' };
    }
  },

  async testDraw(tournamentId) {
    try {
      const { data, error } = await this.getDraw(tournamentId);
      if (error) throw error;

      return {
        data: {
          tournament: {
            id: data.tournament.id,
            name: data.tournament.name,
            teams: data.tournament.teams,
          },
          matches: data.matches,
          matchStructure: {
            totalMatches: data.matches.length,
            roundsCount: Math.max(...data.matches.map((m) => m.round)),
            matchesByRound: data.matches.reduce((acc, match) => {
              acc[match.round] = (acc[match.round] || 0) + 1;
              return acc;
            }, {}),
          },
        },
      };
    } catch (error) {
      console.error('Error in testDraw:', error);
      return { error: 'Failed to test tournament draw' };
    }
  },
};

function generateMatchStructure(tournamentId, teams) {
  const numTeams = teams.length;
  const numRounds = Math.ceil(Math.log2(numTeams));
  const matches = [];

  // Create first round matches
  for (let i = 0; i < Math.floor(numTeams/2); i++) {
    matches.push({
      id: randomUUID(),
      tournament_id: tournamentId,
      round: 1,
      position: i + 1,
      team1_id: teams[i*2].id,
      team2_id: teams[i*2 + 1]?.id || null
    });
  }

  // Create subsequent rounds
  for (let round = 2; round <= numRounds; round++) {
    const matchesInRound = Math.pow(2, numRounds - round);
    for (let i = 0; i < matchesInRound; i++) {
      matches.push({
        id: randomUUID(),
        tournament_id: tournamentId,
        round: round,
        position: i + 1,
        team1_id: null,
        team2_id: null
      });
    }
  }

  return matches;
}

// Add other tournament format generators as needed 