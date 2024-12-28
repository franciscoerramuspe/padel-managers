import { randomUUID } from 'crypto';
import db from '../../config/database.js';

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

    return matches;
  }

  generateRoundRobinMatches(teams, tournamentId) {
    const matches = [];
    const numTeams = teams.length;
    
    const teamsForSchedule = numTeams % 2 === 0 ? teams : [...teams, { id: 'bye', name: 'BYE' }];
    const numRounds = teamsForSchedule.length - 1;
    const halfSize = teamsForSchedule.length / 2;

    let teamIndexes = teamsForSchedule.map((_, i) => i).slice(1);

    for (let round = 0; round < numRounds; round++) {
      const newTeamIndexes = [0, ...teamIndexes];

      for (let i = 0; i < halfSize; i++) {
        const team1 = teamsForSchedule[newTeamIndexes[i]];
        const team2 = teamsForSchedule[newTeamIndexes[teamsForSchedule.length - 1 - i]];

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

      teamIndexes.unshift(teamIndexes.pop());
    }

    return matches;
  }

  async updateMatchScore(matchId, scoreData) {
    try {
      const { team1_score, team2_score, winner_id } = scoreData;

      const { data: existingMatch, error: fetchError } = await this.db
        .from('tournament_matches')
        .select('*')
        .eq('id', matchId)
        .single();

      if (fetchError) throw fetchError;
      if (!existingMatch) throw new Error('Match not found');

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

      if (updateError) throw updateError;

      // Get full match details with relations
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

      // If this is a tournament bracket match, update next round
      if (existingMatch.format === 'single_elimination') {
        await this.updateNextRoundMatch(existingMatch);
      }

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

  async updateMatchDetails(matchId, updateData) {
    try {
      const { court, scheduledTime, scoreTeam1, scoreTeam2, team1Id, team2Id } = updateData;

      const updates = {};
      if (court) updates.court_id = court;
      if (scheduledTime) {
        updates.scheduled_start = scheduledTime;
        updates.scheduled_end = new Date(new Date(scheduledTime).getTime() + 60 * 60 * 1000);
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

  async generateGroupStageGroups(tournamentId, numberOfGroups = 2) {
    console.log('Iniciando generación de grupos para torneo:', tournamentId);
    
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

    if (tournamentError) throw tournamentError;

    if (!tournament.tournament_teams || tournament.tournament_teams.length === 0) {
      throw new Error('No hay equipos en el torneo');
    }

    const teams = tournament.tournament_teams
      .map((tt, index) => ({
        ...tt.team,
        seed: index + 1
      }));

    if (teams.length < numberOfGroups * 2) {
      throw new Error(`No hay suficientes equipos (${teams.length}) para el número de grupos solicitado (${numberOfGroups})`);
    }

    const groups = {};
    const groupNames = Array(numberOfGroups)
      .fill()
      .map((_, i) => String.fromCharCode(65 + i));

    groupNames.forEach(letter => {
      groups[`grupo${letter}`] = {
        name: `GRUPO ${letter}`,
        teams: []
      };
    });

    let forward = true;
    let currentGroupIndex = 0;

    teams.forEach((team) => {
      const groupLetter = groupNames[currentGroupIndex];
      groups[`grupo${groupLetter}`].teams.push({
        name: team.name,
        id: team.id,
        seed: team.seed
      });

      if (forward) {
        currentGroupIndex++;
        if (currentGroupIndex >= numberOfGroups) {
          currentGroupIndex = numberOfGroups - 1;
          forward = false;
        }
      } else {
        currentGroupIndex--;
        if (currentGroupIndex < 0) {
          currentGroupIndex = 0;
          forward = true;
        }
      }
    });

    return groups;
  }
}

// Create and export the instance
export const tournamentDrawService = new TournamentDrawService(db);
