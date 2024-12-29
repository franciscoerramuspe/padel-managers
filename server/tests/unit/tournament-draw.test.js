import { describe, expect, it, jest } from '@jest/globals';
import { TournamentDrawService } from '../../services/tournament/tournament-draw.js';

describe('TournamentDrawService', () => {
  let mockDb;
  
  beforeEach(() => {
    mockDb = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockImplementation(() => {
        return {
          eq: jest.fn().mockResolvedValue({
            data: [
              {
                group: 'A',
                team1_id: 'team1',
                team2_id: 'team2',
                winner_id: 'team1',
                team1_score: {
                  sets: [
                    { games: 6, tiebreak: null },
                    { games: 6, tiebreak: null }
                  ]
                },
                team2_score: {
                  sets: [
                    { games: 2, tiebreak: null },
                    { games: 3, tiebreak: null }
                  ]
                },
                status: 'completed'
              }
            ],
            error: null
          })
        };
      })
    };
  });

  it('should correctly calculate standings with tiebreakers', async () => {
    const service = new TournamentDrawService(mockDb);
    
    const standings = await service.getGroupStandings('tournament1');
    
    // Debug log to see what we're getting
    console.log('Calculated standings:', JSON.stringify(standings, null, 2));
    
    // Basic structure checks
    expect(standings).toBeDefined();
    expect(standings.A).toBeDefined();
    expect(standings.A.length).toBe(2); // Should have two teams
    
    // Find winner and loser in standings
    const winner = standings.A.find(team => team.teamId === 'team1');
    const loser = standings.A.find(team => team.teamId === 'team2');
    
    // Check winner stats
    expect(winner).toBeDefined();
    expect(winner.matchesPlayed).toBe(1);
    expect(winner.wins).toBe(1);
    expect(winner.setsWon).toBe(2);
    expect(winner.gamesWon).toBe(12);
    
    // Check loser stats
    expect(loser).toBeDefined();
    expect(loser.matchesPlayed).toBe(1);
    expect(loser.losses).toBe(1);
    expect(loser.setsWon).toBe(0);
    expect(loser.gamesWon).toBe(5);
    
    // Verify they're in the correct order (winner first)
    expect(standings.A[0].teamId).toBe('team1');
    expect(standings.A[1].teamId).toBe('team2');
  });
}); 