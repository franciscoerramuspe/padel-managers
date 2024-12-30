import { describe, expect, it, jest } from '@jest/globals';
import { TournamentDrawService } from '../../services/tournament/tournament-draw.js';

describe('TournamentDrawService', () => {
  let mockDb;
  
  beforeEach(() => {
    mockDb = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn()
    };
  });

  describe('getGroupStandings', () => {
    it('should handle multiple matches in the same group', async () => {
      mockDb.eq.mockImplementation(() => ({
        eq: jest.fn().mockResolvedValue({
          data: [
            {
              group: 'A',
              team1_id: 'team1',
              team2_id: 'team2',
              winner_id: 'team1',
              team1_score: { sets: [{ games: 6, tiebreak: null }, { games: 6, tiebreak: null }] },
              team2_score: { sets: [{ games: 2, tiebreak: null }, { games: 3, tiebreak: null }] },
              status: 'completed'
            },
            {
              group: 'A',
              team1_id: 'team1',
              team2_id: 'team3',
              winner_id: 'team3',
              team1_score: { sets: [{ games: 4, tiebreak: null }, { games: 4, tiebreak: null }] },
              team2_score: { sets: [{ games: 6, tiebreak: null }, { games: 6, tiebreak: null }] },
              status: 'completed'
            }
          ],
          error: null
        })
      }));

      const service = new TournamentDrawService(mockDb);
      const standings = await service.getGroupStandings('tournament1');
      
      expect(standings.A.length).toBe(3); // Should have three teams
      expect(standings.A[0].points).toBe(3); // team1: 2 points for win + 1 for loss
      expect(standings.A[1].points).toBe(2); // team3: 2 points for win
      expect(standings.A[2].points).toBe(1); // team2: 1 point for loss
    });

    it('should handle tiebreaks correctly', async () => {
      mockDb.eq.mockImplementation(() => ({
        eq: jest.fn().mockResolvedValue({
          data: [
            {
              group: 'A',
              team1_id: 'team1',
              team2_id: 'team2',
              winner_id: 'team1',
              team1_score: { sets: [{ games: 7, tiebreak: 7 }, { games: 6, tiebreak: null }] },
              team2_score: { sets: [{ games: 6, tiebreak: 5 }, { games: 4, tiebreak: null }] },
              status: 'completed'
            }
          ],
          error: null
        })
      }));

      const service = new TournamentDrawService(mockDb);
      const standings = await service.getGroupStandings('tournament1');
      
      expect(standings.A[0].setsWon).toBe(2);
      expect(standings.A[0].gamesWon).toBe(13);
    });

    it('should handle empty groups', async () => {
      mockDb.eq.mockImplementation(() => ({
        eq: jest.fn().mockResolvedValue({
          data: [],
          error: null
        })
      }));

      const service = new TournamentDrawService(mockDb);
      const standings = await service.getGroupStandings('tournament1');
      
      expect(standings).toEqual({});
    });

    it('should handle database errors', async () => {
      mockDb.eq.mockImplementation(() => ({
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: new Error('Database error')
        })
      }));

      const service = new TournamentDrawService(mockDb);
      
      await expect(service.getGroupStandings('tournament1')).rejects.toThrow('Database error');
    });
  });
}); 