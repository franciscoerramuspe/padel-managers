import db from '../config/database.js';
import { randomUUID } from 'crypto';

export const tournamentDrawService = {
  async createDraw(tournamentId) {
    try {
      const { data: tournament, error: tournamentError } = await db
        .from('tournaments')
        .select('*, teams(*)')
        .eq('id', tournamentId)
        .single();

      if (tournamentError) throw tournamentError;

      if (!tournament.teams || tournament.teams.length < 2) {
        return { error: 'Not enough teams to create a draw' };
      }

      // Choose draw generation based on format
      let matches;
      switch (tournament.format) {
        case 'single_elimination':
          matches = generateSingleEliminationMatches(tournament);
          break;
        case 'round_robin':
          matches = generateRoundRobinMatches(tournament);
          break;
        default:
          return { error: 'Invalid tournament format' };
      }

      // Insert matches into database
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
      // Get matches with team details
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

      // Format matches by round for easier visualization
      const formattedMatches = matches.map(match => ({
        id: match.id,
        round: match.round,
        position: match.position,
        team1: match.team1?.name || 'TBD',
        team2: match.team2?.name || 'TBD',
        winner: match.winner?.name,
        team1_id: match.team1_id,
        team2_id: match.team2_id,
        winner_id: match.winner_id
      }));

      // Group matches by round
      const matchesByRound = formattedMatches.reduce((acc, match) => {
        if (!acc[match.round]) {
          acc[match.round] = [];
        }
        acc[match.round].push(match);
        return acc;
      }, {});

      return { 
        data: { 
          matches: formattedMatches,
          matchesByRound,
          roundCount: Math.max(...matches.map(m => m.round))
        } 
      };
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

  async updateMatchResult(matchId, winnerId) {
    try {
      // 1. Update current match with winner
      const { data: match, error: matchError } = await db
        .from('tournament_matches')
        .update({ winner_id: winnerId })
        .eq('id', matchId)
        .select()
        .single();

      if (matchError) throw matchError;

      // 2. Find the next match in the tournament
      const nextRoundPosition = Math.ceil(match.position / 2);
      const { data: nextMatch, error: nextMatchError } = await db
        .from('tournament_matches')
        .select('*')
        .eq('tournament_id', match.tournament_id)
        .eq('round', match.round + 1)
        .eq('position', nextRoundPosition)
        .single();

      if (nextMatchError && nextMatchError.code !== 'PGRST116') throw nextMatchError;

      // 3. If there's a next match, update it with the winner
      if (nextMatch) {
        const isFirstTeam = match.position % 2 !== 0;
        const updateData = isFirstTeam 
          ? { team1_id: winnerId }
          : { team2_id: winnerId };

        const { error: updateError } = await db
          .from('tournament_matches')
          .update(updateData)
          .eq('id', nextMatch.id);

        if (updateError) throw updateError;
      }

      return { data: match };
    } catch (error) {
      console.error('Error in updateMatchResult:', error);
      return { error: 'Failed to update match result' };
    }
  },

  async getMatchDetails(matchId) {
    try {
      const { data, error } = await db
        .from('tournament_matches')
        .select(`
          *,
          team1:team1_id (id, name),
          team2:team2_id (id, name),
          winner:winner_id (id, name)
        `)
        .eq('id', matchId)
        .single();

      if (error) throw error;
      return { data };
    } catch (error) {
      console.error('Error in getMatchDetails:', error);
      return { error: 'Failed to fetch match details' };
    }
  },

  async scheduleMatch(matchId, scheduleData) {
    try {
      const { court_id, start_time, end_time } = scheduleData;

      // Parse timestamps to ensure proper format
      const scheduledStart = new Date(start_time).toISOString();
      const scheduledEnd = new Date(end_time).toISOString();

      // Update match with schedule
      const { data: match, error: updateError } = await db
        .from('tournament_matches')
        .update({
          court_id,
          scheduled_start: scheduledStart,
          scheduled_end: scheduledEnd
        })
        .eq('id', matchId)
        .select()
        .single();

      if (updateError) throw updateError;

      return { data: match };
    } catch (error) {
      console.error('Error in scheduleMatch:', error);
      return { error: 'Failed to schedule match' };
    }
  },

  async updateMatchScore(matchId, scoreData) {
    try {
      const { team1_score, team2_score, winner_id } = scoreData;

      const { data: match, error: updateError } = await db
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

      if (updateError) throw updateError;

      // Check if tournament is completed
      await this.checkTournamentCompletion(match.tournament_id);

      return { data: match };
    } catch (error) {
      console.error('Error in updateMatchScore:', error);
      return { error: 'Failed to update match score' };
    }
  },

  async checkTournamentCompletion(tournamentId) {
    try {
      // Get all matches for tournament
      const { data: matches, error: matchesError } = await db
        .from('tournament_matches')
        .select('*')
        .eq('tournament_id', tournamentId);

      if (matchesError) throw matchesError;

      // Check if all matches have winners
      const allMatchesCompleted = matches.every(match => match.winner_id);

      if (allMatchesCompleted) {
        // Update tournament status
        const { error: updateError } = await db
          .from('tournaments')
          .update({ status: 'completed' })
          .eq('id', tournamentId);

        if (updateError) throw updateError;
      }
    } catch (error) {
      console.error('Error in checkTournamentCompletion:', error);
    }
  }
};

function generateSingleEliminationMatches(tournament) {
  const teams = tournament.teams;
  const numTeams = teams.length;
  const numRounds = Math.ceil(Math.log2(numTeams));
  const matches = [];

  // Create first round matches
  for (let i = 0; i < Math.floor(numTeams/2); i++) {
    matches.push({
      id: randomUUID(),
      tournament_id: tournament.id,
      round: 1,
      position: i + 1,
      team1_id: teams[i*2].id,
      team2_id: teams[i*2 + 1]?.id || null,
      format: 'single_elimination'
    });
  }

  // Create subsequent rounds
  for (let round = 2; round <= numRounds; round++) {
    const matchesInRound = Math.pow(2, numRounds - round);
    for (let i = 0; i < matchesInRound; i++) {
      matches.push({
        id: randomUUID(),
        tournament_id: tournament.id,
        round: round,
        position: i + 1,
        team1_id: null,
        team2_id: null,
        format: 'single_elimination'
      });
    }
  }

  return matches;
}

function generateRoundRobinMatches(tournament) {
  const teams = tournament.teams;
  const matches = [];
  
  // If odd number of teams, add a "bye" team
  if (teams.length % 2 !== 0) {
    teams.push({ id: null, name: 'BYE' });
  }

  const n = teams.length;
  const rounds = n - 1;
  const matchesPerRound = n / 2;

  // Create array of team indices
  let teamIndices = teams.map((_, index) => index);
  const firstTeam = teamIndices.shift();

  for (let round = 1; round <= rounds; round++) {
    // Add first team's match
    if (teams[teamIndices[0]].id !== null) {
      matches.push({
        id: randomUUID(),
        tournament_id: tournament.id,
        round: round,
        position: 1,
        team1_id: teams[firstTeam].id,
        team2_id: teams[teamIndices[0]].id,
        format: 'round_robin'
      });
    }

    // Add other matches
    for (let match = 1; match < matchesPerRound; match++) {
      const team1Index = teamIndices[match];
      const team2Index = teamIndices[teamIndices.length - match];

      if (teams[team1Index].id !== null && teams[team2Index].id !== null) {
        matches.push({
          id: randomUUID(),
          tournament_id: tournament.id,
          round: round,
          position: match + 1,
          team1_id: teams[team1Index].id,
          team2_id: teams[team2Index].id,
          format: 'round_robin'
        });
      }
    }

    // Rotate teams (except first team)
    teamIndices.push(teamIndices.shift());
  }

  return matches;
}
