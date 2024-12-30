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

  async getGroupStageGroups(tournamentId) {
    try {
      const { data: groups, error } = await this.db
        .from('tournament_groups')
        .select('*')
        .eq('tournament_id', tournamentId);

      if (error) throw error;
      return { groups };
    } catch (error) {
      console.error('Error getting groups:', error);
      return { error: 'Failed to get tournament groups' };
    }
  }

  async generateGroupStageGroups(tournamentId, numberOfGroups = 2) {
    try {
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

      // Before saving, check if groups exist and delete old matches
      await this.db
        .from('tournament_matches')
        .delete()
        .eq('tournament_id', tournamentId)
        .eq('round', 1); // Delete only group stage matches

      // Use upsert instead of insert for groups
      const { error } = await this.db
        .from('tournament_groups')
        .upsert({
          tournament_id: tournamentId,
          groups: groups,
          created_at: new Date().toISOString()
        }, {
          onConflict: 'tournament_id'
        });

      if (error) throw error;
      return groups;
    } catch (error) {
      console.error('Error generating groups:', error);
      throw error;
    }
  }

  async calculateGroupStandings(tournamentId, groupId) {
    try {
      const { data: matches, error } = await this.db
        .from('tournament_matches')
        .select(`
          *,
          team1:team1_id(id, name),
          team2:team2_id(id, name)
        `)
        .eq('tournament_id', tournamentId)
        .eq('group', groupId)
        .eq('round', 1); // Group stage matches are in round 1

      if (error) throw error;

      const standings = {};
      
      // Initialize standings for all teams
      matches.forEach(match => {
        if (!standings[match.team1_id]) {
          standings[match.team1_id] = {
            teamId: match.team1_id,
            teamName: match.team1.name,
            played: 0,
            won: 0,
            lost: 0,
            points: 0
          };
        }
        if (!standings[match.team2_id]) {
          standings[match.team2_id] = {
            teamId: match.team2_id,
            teamName: match.team2.name,
            played: 0,
            won: 0,
            lost: 0,
            points: 0
          };
        }
      });

      // Calculate standings
      matches.forEach(match => {
        if (!match.winner_id) return;

        standings[match.team1_id].played++;
        standings[match.team2_id].played++;

        if (match.winner_id === match.team1_id) {
          standings[match.team1_id].won++;
          standings[match.team1_id].points += 3;
          standings[match.team2_id].lost++;
        } else {
          standings[match.team2_id].won++;
          standings[match.team2_id].points += 3;
          standings[match.team1_id].lost++;
        }
      });

      return Object.values(standings).sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.won !== a.won) return b.won - a.won;
        return b.played - a.played;
      });
    } catch (error) {
      console.error('Error calculating group standings:', error);
      throw error;
    }
  }

  async generateKnockoutPhase(tournamentId, teamsPerGroup) {
    try {
      // Get group standings
      const standings = await this.getGroupStandings(tournamentId);
      
      // Get qualified teams based on admin's selection
      const qualifiedTeams = [];
      for (const [group, groupStandings] of Object.entries(standings)) {
        const advancingTeams = groupStandings.slice(0, teamsPerGroup).map((team, index) => ({
          ...team,
          groupPosition: index + 1,
          group
        }));
        qualifiedTeams.push(...advancingTeams);
      }

      // Calculate the number of rounds needed
      // For example: 5-8 teams need 3 rounds, 9-16 teams need 4 rounds
      const totalTeams = qualifiedTeams.length;
      const rounds = Math.ceil(Math.log2(totalTeams));
      const totalMatches = Math.pow(2, rounds) - 1;
      const firstRoundMatches = Math.pow(2, rounds - 1);
      const byes = Math.pow(2, rounds) - totalTeams; // Number of teams that get a "bye"

      // Create all knockout matches
      const knockoutMatches = [];
      let position = 1;
      let currentRound = 1;
      let matchesInRound = firstRoundMatches;

      while (currentRound <= rounds) {
        for (let i = 0; i < matchesInRound; i++) {
          const match = {
            id: crypto.randomUUID(),
            tournament_id: tournamentId,
            round: currentRound,
            position: position++,
            team1_id: null,
            team2_id: null,
            status: 'pending',
            created_at: new Date().toISOString()
          };

          // For first round matches, assign teams if we have them
          if (currentRound === 1) {
            const team1Index = i * 2;
            const team2Index = i * 2 + 1;

            if (team1Index < qualifiedTeams.length) {
              match.team1_id = qualifiedTeams[team1Index].teamId;
            }
            if (team2Index < qualifiedTeams.length) {
              match.team2_id = qualifiedTeams[team2Index].teamId;
            }
          }

          knockoutMatches.push(match);
        }

        matchesInRound = matchesInRound / 2;
        currentRound++;
      }

      // Insert knockout matches into database
      const { error } = await this.db
        .from('tournament_matches')
        .insert(knockoutMatches);

      if (error) throw error;

      return {
        message: 'Knockout phase generated successfully',
        matches: knockoutMatches,
        qualifiedTeams,
        totalRounds: rounds
      };
    } catch (error) {
      console.error('Error generating knockout phase:', error);
      throw error;
    }
  }

  async isGroupStageComplete(tournamentId) {
    try {
      const { data: matches, error } = await this.db
        .from('tournament_matches')
        .select('*')
        .eq('tournament_id', tournamentId)
        .eq('round', 1); // Group stage matches

      if (error) throw error;

      // Check if all matches have a winner
      return matches.every(match => match.winner_id !== null);
    } catch (error) {
      console.error('Error checking group stage completion:', error);
      throw error;
    }
  }

  async generateGroupMatches(tournamentId, groups) {
    try {
      // First delete all existing group matches
      await this.db
        .from('tournament_matches')
        .delete()
        .eq('tournament_id', tournamentId)
        .eq('round', 1);  // Delete only group stage matches
      
      const matches = [];
      let position = 1;
      
      // Debug log
      console.log('Groups received:', groups);
      
      // For each group, generate round robin matches
      for (const [groupId, group] of Object.entries(groups)) {
        const teams = group.teams;
        console.log(`Generating matches for ${groupId} with teams:`, teams);
        
        // Generate round-robin matches for this group
        for (let i = 0; i < teams.length; i++) {
          for (let j = i + 1; j < teams.length; j++) {
            const match = {
              id: randomUUID(),
              tournament_id: tournamentId,
              round: 1,
              position: position++,
              team1_id: teams[i].id,
              team2_id: teams[j].id,
              group: groupId,
              status: 'pending',
              created_at: new Date().toISOString()
            };
            console.log('Creating match:', match);
            matches.push(match);
          }
        }
      }

      console.log('Total matches to create:', matches.length);

      // Insert all matches into the database
      const { error } = await this.db
        .from('tournament_matches')
        .insert(matches);

      if (error) throw error;
      
      return matches;
    } catch (error) {
      console.error('Error generating group matches:', error);
      throw error;
    }
  }

  async updateMatch(matchId, { teams, winner_id }) {
    try {
      const { data: match, error: matchError } = await this.db
        .from('tournament_matches')
        .select('*')
        .eq('id', matchId)
        .single();

      if (matchError) throw matchError;
      if (!match) throw new Error('Match not found');

      // Debug logs
      console.log('Match:', match);
      console.log('Incoming winner_id:', winner_id);
      console.log('team1_id:', match.team1_id);
      console.log('team2_id:', match.team2_id);
      console.log('Comparison:', {
        isTeam1: winner_id === match.team1_id,
        isTeam2: winner_id === match.team2_id
      });

      // Validate that winner_id is one of the teams
      if (winner_id !== match.team1_id && winner_id !== match.team2_id) {
        throw new Error('Winner must be one of the teams in the match');
      }

      // Find team scores from request
      const team1 = teams.find(t => t.id === match.team1_id);
      const team2 = teams.find(t => t.id === match.team2_id);

      if (!team1 || !team2) {
        throw new Error('Scores must be provided for both teams');
      }

      // Validate score format
      if (!this.isValidScore(team1.score) || !this.isValidScore(team2.score)) {
        throw new Error('Invalid score format');
      }

      // Validate 7-5 and 7-6 scenarios
      team1.score.sets.forEach((set, index) => {
        const team2Set = team2.score.sets[index];
        if (set.games === 7) {
          if (team2Set.games !== 5 && team2Set.games !== 6) {
            throw new Error('When games is 7, opponent must have 5 or 6 games');
          }
          if (team2Set.games === 6 && set.tiebreak === null) {
            throw new Error('Tiebreak score required for 7-6 set');
          }
          if (team2Set.games === 5 && set.tiebreak !== null) {
            throw new Error('No tiebreak allowed for 7-5 set');
          }
        }
      });

      // Do the same check for team2's sets
      team2.score.sets.forEach((set, index) => {
        const team1Set = team1.score.sets[index];
        if (set.games === 7) {
          if (team1Set.games !== 5 && team1Set.games !== 6) {
            throw new Error('When games is 7, opponent must have 5 or 6 games');
          }
          if (team1Set.games === 6 && set.tiebreak === null) {
            throw new Error('Tiebreak score required for 7-6 set');
          }
          if (team1Set.games === 5 && set.tiebreak !== null) {
            throw new Error('No tiebreak allowed for 7-5 set');
          }
        }
      });

      // Validate that the winner actually won based on sets
      const team1SetsWon = team1.score.sets.filter(set => 
        set.games > (team2.score.sets[team1.score.sets.indexOf(set)].games) ||
        (set.games === 6 && set.tiebreak > team2.score.sets[team1.score.sets.indexOf(set)].tiebreak)
      ).length;

      const team2SetsWon = team2.score.sets.filter(set =>
        set.games > (team1.score.sets[team2.score.sets.indexOf(set)].games) ||
        (set.games === 6 && set.tiebreak > team1.score.sets[team2.score.sets.indexOf(set)].tiebreak)
      ).length;

      if ((team1SetsWon > team2SetsWon && winner_id !== match.team1_id) ||
          (team2SetsWon > team1SetsWon && winner_id !== match.team2_id)) {
        throw new Error('Winner ID does not match the score');
      }

      const { error } = await this.db
        .from('tournament_matches')
        .update({
          winner_id,
          team1_score: team1.score,
          team2_score: team2.score,
          status: 'completed'
        })
        .eq('id', matchId);

      if (error) throw error;

      return { message: 'Match updated successfully' };
    } catch (error) {
      console.error('Error updating match:', error);
      throw error;
    }
  }

  isValidScore(score) {
    console.log('score', score);
    if (!score || !Array.isArray(score.sets)) return false;
    
    return score.sets.every(set => {
      console.log('set', set);
      // Games must be numbers between 0 and 7
      if (typeof set.games !== 'number' || set.games < 0 || set.games > 7) return false;
      
      // Tiebreak must be null or a number >= 0
      if (set.tiebreak !== null && (typeof set.tiebreak !== 'number' || set.tiebreak < 0)) return false;
      
      return true;
    });
  }

  async getGroupStandings(tournamentId) {
    try {
      const { data: matches, error: matchError } = await this.db
        .from('tournament_matches')
        .select(`
          *,
          team1:team1_id(id, name),
          team2:team2_id(id, name)
        `)
        .eq('tournament_id', tournamentId)
        .eq('status', 'completed');

      if (matchError) throw matchError;

      const standings = {};

      matches.forEach(match => {
        if (!match.group) return;
        if (!standings[match.group]) {
          standings[match.group] = new Map();
        }

        [match.team1, match.team2].forEach(team => {
          if (!team) return; // Skip if team is null
          if (!standings[match.group].has(team.id)) {
            standings[match.group].set(team.id, {
              teamId: team.id,
              teamName: team.name,
              matchesPlayed: 0,
              wins: 0,
              losses: 0,
              points: 0,
              setsWon: 0,
              setsLost: 0,
              setsDiff: 0,
              gamesWon: 0,
              gamesLost: 0,
              gamesDiff: 0
            });
          }
        });

        // Skip match stats calculation if scores aren't set
        if (!match.team1_score?.sets || !match.team2_score?.sets) return;

        const team1 = standings[match.group].get(match.team1.id);
        const team2 = standings[match.group].get(match.team2.id);
        
        let team1SetsWon = 0;
        let team1GamesWon = 0;
        let team2SetsWon = 0;
        let team2GamesWon = 0;

        match.team1_score.sets.forEach((set, index) => {
          if (!set || !match.team2_score.sets[index]) return; // Skip invalid sets
          
          const team2Set = match.team2_score.sets[index];
          
          team1GamesWon += set.games || 0;
          team2GamesWon += team2Set.games || 0;

          if ((set.games > team2Set.games) || 
              (set.games === 6 && set.tiebreak > team2Set.tiebreak)) {
            team1SetsWon++;
          } else {
            team2SetsWon++;
          }
        });

        // Update match stats
        team1.matchesPlayed++;
        team2.matchesPlayed++;

        if (match.winner_id === match.team1.id) {
          team1.wins++;
          team1.points += 2;
          team2.losses++;
          team2.points += 1;
        } else if (match.winner_id === match.team2.id) {
          team2.wins++;
          team2.points += 2;
          team1.losses++;
          team1.points += 1;
        }

        team1.setsWon += team1SetsWon;
        team1.setsLost += team2SetsWon;
        team1.gamesWon += team1GamesWon;
        team1.gamesLost += team2GamesWon;

        team2.setsWon += team2SetsWon;
        team2.setsLost += team1SetsWon;
        team2.gamesWon += team2GamesWon;
        team2.gamesLost += team1GamesWon;
      });

      // Calculate differences and sort
      const result = {};
      for (const [group, groupStandings] of Object.entries(standings)) {
        for (const team of groupStandings.values()) {
          team.setsDiff = team.setsWon - team.setsLost;
          team.gamesDiff = team.gamesWon - team.gamesLost;
        }

        result[group] = Array.from(groupStandings.values())
          .sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.setsDiff !== a.setsDiff) return b.setsDiff - a.setsDiff;
            if (b.gamesDiff !== a.gamesDiff) return b.gamesDiff - a.gamesDiff;
            return 0;
          });
      }

      return result;
    } catch (error) {
      console.error('Error getting group standings:', error);
      throw error;
    }
  }
  async getGroupStatus(tournamentId) {
    try {
      // Get all group matches (round 1 AND has a group assigned)
      const { data: matches, error } = await this.db
        .from('tournament_matches')
        .select('*')
        .eq('tournament_id', tournamentId)
        .eq('round', 1)
        .not('group', 'is', null);  // Only matches that have a group assigned

      if (error) throw error;

      console.log('Found matches:', matches.map(m => ({
        id: m.id,
        group: m.group,
        team1_id: m.team1_id,
        team2_id: m.team2_id
      })));

      const totalMatches = matches.length;
      const completedMatches = matches.filter(m => m.winner_id).length;
      const isComplete = totalMatches > 0 && completedMatches === totalMatches;

      return {
        totalMatches,
        completedMatches,
        isComplete
      };
    } catch (error) {
      console.error('Error getting group status:', error);
      throw error;
    }
  }
}

// Create and export the instance
export const tournamentDrawService = new TournamentDrawService(db);
