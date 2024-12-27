import { randomUUID } from 'crypto';

export class TournamentDrawService {
  constructor(db) {
    this.db = db;
  }

  async createDraw(tournamentId) {
    try {
      console.log('Creating draw for tournament:', tournamentId);
      
      const { data: tournament, error: tournamentError } = await this.db
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
        .eq('id', tournamentId)
        .single();

      console.log('Tournament data:', tournament);
      console.log('Tournament error:', tournamentError);

      if (tournamentError) throw tournamentError;

      const teams = tournament.tournament_teams.map(tt => tt.team);

      if (!teams || teams.length < 2) {
        return { 
          error: 'Not enough teams to create a draw', 
          details: 'Tournament must have at least 2 teams to generate a draw' 
        };
      }

      let matches;
      switch (tournament.format) {
        case 'single_elimination':
          matches = this.generateSingleEliminationMatches(teams, tournamentId);
          break;
        case 'round_robin':
          matches = this.generateRoundRobinMatches(teams, tournamentId);
          break;
        default:
          return { error: 'Invalid tournament format' };
      }

      const { error: matchesError } = await this.db
        .from('tournament_matches')
        .insert(matches);

      if (matchesError) throw matchesError;

      return { data: matches };
    } catch (error) {
      console.error('Error in createDraw:', error);
      return { error: 'Failed to create tournament draw' };
    }
  }

  generateSingleEliminationMatches(teams, tournamentId) {
    const numTeams = teams.length;
    const numRounds = Math.ceil(Math.log2(numTeams));
    const matches = [];

    // First round matches
    const firstRoundMatches = Math.min(numTeams / 2, Math.pow(2, numRounds - 1));
    for (let i = 0; i < firstRoundMatches; i++) {
      const team1Index = i * 2;
      const team2Index = i * 2 + 1;

      matches.push({
        id: randomUUID(),
        tournament_id: tournamentId,
        round: 1,
        position: i + 1,
        team1_id: team1Index < teams.length ? teams[team1Index].id : null,
        team2_id: team2Index < teams.length ? teams[team2Index].id : null,
        winner_id: null,
        status: 'pending'
      });
    }

    // Generate subsequent rounds
    let currentRound = 2;
    let matchesInRound = firstRoundMatches / 2;

    while (matchesInRound > 0) {
      for (let i = 0; i < matchesInRound; i++) {
        matches.push({
          id: randomUUID(),
          tournament_id: tournamentId,
          round: currentRound,
          position: i + 1,
          team1_id: null,
          team2_id: null,
          winner_id: null,
          status: 'pending'
        });
      }
      currentRound++;
      matchesInRound = Math.floor(matchesInRound / 2);
    }

    console.log('Generated matches:', matches);
    return matches;
  }

  generateRoundRobinMatches(teams, tournamentId) {
    const matches = [];
    const numTeams = teams.length;
    
    // If odd number of teams, add a "bye" team
    const teamsForSchedule = numTeams % 2 === 0 ? teams : [...teams, { id: 'bye', name: 'BYE' }];
    const numRounds = teamsForSchedule.length - 1;
    const halfSize = teamsForSchedule.length / 2;

    // Generate rounds using "circle method"
    let teamIndexes = teamsForSchedule.map((_, i) => i).slice(1);

    for (let round = 0; round < numRounds; round++) {
      // First team is fixed, others rotate
      const roundMatches = [];
      const newTeamIndexes = [0, ...teamIndexes];

      for (let i = 0; i < halfSize; i++) {
        const team1 = teamsForSchedule[newTeamIndexes[i]];
        const team2 = teamsForSchedule[newTeamIndexes[teamsForSchedule.length - 1 - i]];

        // Don't create matches involving the "bye" team
        if (team1.id !== 'bye' && team2.id !== 'bye') {
          matches.push({
            id: randomUUID(),
            tournament_id: tournamentId,
            round: round + 1,
            position: i + 1,
            team1_id: team1.id,
            team2_id: team2.id,
            winner_id: null,
            status: 'pending'
          });
        }
      }

      // Rotate teams for next round (except first team)
      teamIndexes.unshift(teamIndexes.pop());
    }

    console.log('Generated round robin matches:', matches);
    return matches;
  }

  async updateMatchScore(matchId, scoreData) {
    try {
      const { team1_score, team2_score, winner_id } = scoreData;

      const { data, error } = await this.db
        .from('tournament_matches')
        .update({
          score: {
            team1: team1_score,
            team2: team2_score
          },
          winner_id,
          status: 'completed'
        })
        .eq('id', matchId)
        .select()
        .single();

      if (error) throw error;

      // If this is a tournament bracket match, update next round
      if (data.format === 'single_elimination') {
        await this.updateNextRoundMatch(data);
      }

      return { data };
    } catch (error) {
      console.error('Error updating match score:', error);
      return { error: 'Failed to update match score' };
    }
  }

  async updateMatchDetails(matchId, details) {
    try {
      const { data, error } = await this.db
        .from('tournament_matches')
        .update({
          court: details.court,
          scheduled_time: details.scheduledTime
        })
        .eq('id', matchId)
        .select()
        .single();

      if (error) throw error;
      return { data };
    } catch (error) {
      console.error('Error updating match details:', error);
      return { error: 'Failed to update match details' };
    }
  }

  async updateNextRoundMatch(match) {
    if (!match.winner_id || match.format !== 'single_elimination') return;

    try {
      const { data: nextMatch } = await this.db
        .from('tournament_matches')
        .select()
        .eq('tournament_id', match.tournament_id)
        .eq('round', match.round + 1)
        .eq('format', 'single_elimination')
        .single();

      if (!nextMatch) return;

      const isEvenPosition = match.position % 2 === 0;
      const updateData = isEvenPosition 
        ? { team2_id: match.winner_id }
        : { team1_id: match.winner_id };

      await this.db
        .from('tournament_matches')
        .update(updateData)
        .eq('id', nextMatch.id);

    } catch (error) {
      console.error('Error updating next round match:', error);
    }
  }

  async getMatchDetails(matchId) {
    try {
      const { data, error } = await this.db
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
      console.error('Error getting match details:', error);
      return { error: 'Failed to get match details' };
    }
  }
}
