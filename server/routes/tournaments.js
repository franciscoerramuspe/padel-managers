import express from 'express';
import { tournamentService } from '../services/tournament/tournaments.js';
import { tournamentDrawService } from '../services/tournament/tournament-draw.js';
import { TournamentTeamsService } from '../services/tournament-teams.js';
import { courtService } from '../services/courts.js';
import db from '../config/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const filters = {
    startDate: req.query.startDate,
    endDate: req.query.endDate
  };

  const { data, error } = await tournamentService.getTournaments(filters);
  
  if (error) {
    return res.status(500).json({ error });
  }
  
  res.json(data);
});

router.post('/', async (req, res) => {
  const { data, error } = await tournamentService.createTournament(req.body);
  
  if (error) {
    return res.status(500).json({ error });
  }
  
  res.status(201).json(data);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await tournamentService.getTournamentById(id);
  
  if (error) {
    return res.status(500).json({ error });
  }
  
  res.json(data);
});

router.post('/:id/draw', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await tournamentDrawService.createDraw(id);
  
  if (error) {
    return res.status(500).json({ error });
  }
  
  res.status(201).json(data);
});

router.get('/:id/draw', async (req, res) => {
  try {
    const { data, error } = await tournamentDrawService.getDraw(req.params.id);
    
    if (error) {
      return res.status(400).json({ error });
    }

    res.json(data);
  } catch (error) {
    console.error('Draw fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch draw' });
  }
});

router.get('/:id/draw/test', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await tournamentDrawService.testDraw(id);
  
  if (error) {
    return res.status(500).json({ error });
  }
  
  res.json(data);
});

router.put('/matches/:id/result', async (req, res) => {
  const { id } = req.params;
  const { winner_id } = req.body;
  
  const { data, error } = await tournamentDrawService.updateMatchResult(id, winner_id);
  
  if (error) {
    return res.status(500).json({ error });
  }
  
  res.json(data);
});

router.get('/matches/:id', async (req, res) => {
  const { id } = req.params;
  
  const { data, error } = await tournamentDrawService.getMatchDetails(id);
  
  if (error) {
    return res.status(500).json({ error });
  }
  
  res.json(data);
});

router.post('/matches/:id/schedule', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await courtService.bookCourt(id, req.body);
  
  if (error) {
    return res.status(500).json({ error });
  }
  
  res.json(data);
});

router.put('/matches/:matchId/score', async (req, res) => {
  try {
    const { matchId } = req.params;
    const { team1_score, team2_score, winner_id } = req.body;
    
    console.log('Received score update:', {
      matchId,
      team1_score,
      team2_score,
      winner_id
    });

    // Validate score format
    if (!isValidScoreFormat(team1_score) || !isValidScoreFormat(team2_score)) {
      return res.status(400).json({ 
        error: 'Invalid score format',
        received: {
          team1_score,
          team2_score
        },
        expected: {
          format: "{ sets: [{ games: number, tiebreak: number | null }] }"
        }
      });
    }

    // First update the match
    const { error: updateError } = await db
      .from('tournament_matches')
      .update({
        team1_score,
        team2_score,
        winner_id,
        status: 'completed'
      })
      .eq('id', matchId);

    if (updateError) throw updateError;

    // Then fetch the updated match with team details
    const { data: match, error: fetchError } = await db
      .from('tournament_matches')
      .select(`
        *,
        team1:team1_id (
          id,
          name
        ),
        team2:team2_id (
          id,
          name
        )
      `)
      .eq('id', matchId)
      .single();

    if (fetchError) throw fetchError;

    // Return just the match data without wrapping it
    res.json(match);
  } catch (error) {
    console.error('Error updating match score:', error);
    res.status(500).json({ error: 'Failed to update match score' });
  }
});

router.post('/:id/teams', async (req, res) => {
  try {
    const { teams } = req.body;
    console.log('Registering teams for tournament:', req.params.id);
    console.log('Teams:', teams);

    const teamsService = new TournamentTeamsService(db);
    const { data, error } = await teamsService.registerTeams(req.params.id, teams);
    
    if (error) {
      console.error('Error registering teams:', error);
      return res.status(400).json({ error });
    }

    res.json({ data });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:id/draw/generate', async (req, res) => {
  try {
    const { data, error } = await tournamentDrawService.createDraw(req.params.id);
    
    if (error) {
      return res.status(400).json({ error });
    }

    res.json({ matches: data });
  } catch (error) {
    console.error('Draw generation error:', error);
    res.status(500).json({ error: 'Failed to generate draw' });
  }
});

router.get('/:tournamentId/matches/:matchId', async (req, res) => {
  const { tournamentId, matchId } = req.params;

  try {
    const { data, error } = await tournamentDrawService.getMatchDetails(matchId);
    
    if (error) {
      console.error('Error fetching match:', error);
      return res.status(400).json({ error });
    }

    // Verify match belongs to tournament
    if (data.tournament_id !== tournamentId) {
      return res.status(404).json({ error: 'Match not found in this tournament' });
    }

    res.json({ match: data });
  } catch (error) {
    console.error('Error getting match details:', error);
    res.status(500).json({ error: 'Failed to get match details' });
  }
});

router.patch('/:tournamentId/matches/:matchId', async (req, res) => {
  const { tournamentId, matchId } = req.params;
  const { court, scheduledTime, scoreTeam1, scoreTeam2 } = req.body;

  try {
    // Validate input
    if (scoreTeam1 !== undefined && (isNaN(scoreTeam1) || scoreTeam1 < 0)) {
      return res.status(400).json({ error: 'Invalid score for team 1' });
    }
    if (scoreTeam2 !== undefined && (isNaN(scoreTeam2) || scoreTeam2 < 0)) {
      return res.status(400).json({ error: 'Invalid score for team 2' });
    }

    // Get current match data first
    const { data: currentMatch } = await tournamentDrawService.getMatchDetails(matchId);
    if (!currentMatch || currentMatch.tournament_id !== tournamentId) {
      return res.status(404).json({ error: 'Match not found in this tournament' });
    }

    const { data, error } = await tournamentDrawService.updateMatchDetails(matchId, {
      court,
      scheduledTime,
      scoreTeam1: scoreTeam1 !== undefined ? parseInt(scoreTeam1) : null,
      scoreTeam2: scoreTeam2 !== undefined ? parseInt(scoreTeam2) : null,
      team1Id: currentMatch.team1_id,
      team2Id: currentMatch.team2_id
    });

    if (error) {
      return res.status(400).json({ error });
    }

    res.json({ match: data });
  } catch (error) {
    console.error('Error updating match:', error);
    res.status(500).json({ error: 'Failed to update match' });
  }
});

router.post('/:tournamentId/matches/schedule', async (req, res) => {
  const { tournamentId } = req.params;
  const { matches } = req.body;

  if (!Array.isArray(matches)) {
    return res.status(400).json({ error: 'Matches must be an array' });
  }

  try {
    const updates = [];
    const errors = [];

    for (const match of matches) {
      // Validate each match belongs to tournament
      const { data: currentMatch } = await tournamentDrawService.getMatchDetails(match.id);
      if (!currentMatch || currentMatch.tournament_id !== tournamentId) {
        errors.push(`Match ${match.id} not found in this tournament`);
        continue;
      }

      const { data, error } = await tournamentDrawService.updateMatchDetails(match.id, {
        court: match.court,
        scheduledTime: match.scheduledTime,
        team1Id: currentMatch.team1_id,
        team2Id: currentMatch.team2_id
      });

      if (error) {
        errors.push(`Failed to update match ${match.id}: ${error}`);
      } else {
        updates.push(data);
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ 
        errors,
        partialUpdates: updates
      });
    }

    res.json({ matches: updates });
  } catch (error) {
    console.error('Error scheduling matches:', error);
    res.status(500).json({ error: 'Failed to schedule matches' });
  }
});

// Helper function to validate score format
function isValidScoreFormat(score) {
  if (!score?.sets || !Array.isArray(score.sets)) return false;
  
  return score.sets.every(set => (
    typeof set.games === 'number' &&
    (set.tiebreak === null || typeof set.tiebreak === 'number')
  ));
}

// Register a doubles team with just names
router.post('/:id/teams/register', async (req, res) => {
  try {
    const { player1Name, player2Name } = req.body;
    
    // Validate both names are provided
    if (!player1Name?.trim() || !player2Name?.trim()) {
      return res.status(400).json({ 
        error: 'Both player names are required for registration' 
      });
    }

    // Generate IDs for both players and the team
    const team = {
      id: crypto.randomUUID(),
      name: `${player1Name} / ${player2Name}`,
      players: [
        {
          id: crypto.randomUUID(),
          name: player1Name.trim()
        },
        {
          id: crypto.randomUUID(),
          name: player2Name.trim()
        }
      ]
    };

    const teamsService = new TournamentTeamsService(db);
    const { data, error } = await teamsService.registerTeam(req.params.id, team);
    
    if (error) {
      console.error('Error registering team:', error);
      return res.status(400).json({ error });
    }

    res.json({ data });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id/matches', async (req, res) => {
  try {
    const { id } = req.params;
    const { data: matches, error } = await db
      .from('tournament_matches')
      .select(`
        *,
        team1:team1_id (
          id,
          name
        ),
        team2:team2_id (
          id,
          name
        ),
        court:court_id (
          id,
          name
        )
      `)
      .eq('tournament_id', id);

    if (error) throw error;
    res.json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

router.get('/:id/groups', async (req, res) => {
  try {
    const { id } = req.params;
    const groups = await tournamentDrawService.getGroupStageGroups(id);
    
    if (groups.error) {
      return res.status(400).json({ error: groups.error });
    }

    // If groups exist, return them, otherwise return empty object
    res.json({ groups: groups.groups?.[0]?.groups || {} });
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/groups', async (req, res) => {
  try {
    const { id } = req.params;
    const { numberOfGroups = 2 } = req.body;

    // First generate the groups
    const groups = await tournamentDrawService.generateGroupStageGroups(id, numberOfGroups);
    
    // Then generate the matches for these groups
    const matches = await tournamentDrawService.generateGroupMatches(id, groups);

    res.json({ 
      groups,
      matches 
    });
  } catch (error) {
    console.error('Error generating groups and matches:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/knockout', async (req, res) => {
  try {
    const { id } = req.params;
    const { teamsPerGroup } = req.body;

    if (!teamsPerGroup) {
      return res.status(400).json({ error: 'teamsPerGroup is required' });
    }

    const result = await tournamentDrawService.generateKnockoutPhase(id, teamsPerGroup);
    res.json(result);
  } catch (error) {
    console.error('Error generating knockout phase:', error);
    res.status(500).json({ error: error.message });
  }
});

// We should also modify the match update endpoint to check if group stage is complete
router.post('/matches/:matchId/update', async (req, res) => {
  try {
    const { matchId } = req.params;
    const { teams, winner_id } = req.body;
    
    if (!teams || !winner_id) {
      return res.status(400).json({ 
        error: 'teams and winner_id are required',
        received: { teams: !!teams, winner_id: !!winner_id }
      });
    }

    const result = await tournamentDrawService.updateMatch(matchId, { teams, winner_id });
    res.json(result);
  } catch (error) {
    console.error('Error updating match:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/standings', async (req, res) => {
  try {
    const { id } = req.params;
    const standings = await tournamentDrawService.getGroupStandings(id);
    res.json(standings);
  } catch (error) {
    console.error('Error getting standings:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/group-status', async (req, res) => {
  try {
    const { id } = req.params;
    const status = await tournamentDrawService.getGroupStatus(id);
    res.json(status);
  } catch (error) {
    console.error('Error getting group status:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:tournamentId/scores', async (req, res) => {
  try {
    const { tournamentId } = req.params;
    
    const { data, error } = await db
      .from('tournament_matches')
      .select(`
        id,
        team1_id,
        team2_id,
        winner_id,
        team1_score,
        team2_score,
        status,
        round,
        position,
        group,
        team1:team1_id(id, name),
        team2:team2_id(id, name)
      `)
      .eq('tournament_id', tournamentId)
      .not('team1_score', 'is', null);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching tournament scores:', error);
    res.status(500).json({ error: 'Failed to fetch tournament scores' });
  }
});

export default router; 