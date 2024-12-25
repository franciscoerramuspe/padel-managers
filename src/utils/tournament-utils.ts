export function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function generateInitialMatches(teams: any[], tournamentId: string) {
  const matches = [];
  const numTeams = teams.length;
  const numRounds = Math.ceil(Math.log2(numTeams));

  // Generate first round matches
  for (let i = 0; i < numTeams; i += 2) {
    matches.push({
      tournament_id: tournamentId,
      round: 1,
      position: Math.floor(i / 2),
      team1_id: teams[i]?.id || null,
      team2_id: teams[i + 1]?.id || null,
      next_match_id: null,
    });
  }

  // Generate subsequent rounds (empty matches)
  let currentRoundMatches = Math.floor(numTeams / 2);
  for (let round = 2; round <= numRounds; round++) {
    for (let i = 0; i < currentRoundMatches / 2; i++) {
      matches.push({
        tournament_id: tournamentId,
        round: round,
        position: i,
        team1_id: null,
        team2_id: null,
        next_match_id: null,
      });
    }
    currentRoundMatches = Math.floor(currentRoundMatches / 2);
  }

  return matches;
}

export function generateRoundRobinMatches(teams: any[], tournamentId: string) {
  const matches = [];
  const numTeams = teams.length;

  // For round-robin, each team plays against every other team once
  for (let round = 0; round < numTeams - 1; round++) {
    for (let i = 0; i < numTeams / 2; i++) {
      const team1Index = i;
      const team2Index = numTeams - 1 - i;

      // Rotate teams for each round (except team at position 0)
      const actualTeam1Index =
        team1Index === 0 ? 0 : (team1Index + round) % (numTeams - 1);
      const actualTeam2Index =
        team2Index === numTeams - 1
          ? numTeams - 1
          : (team2Index + round) % (numTeams - 1);

      matches.push({
        tournament_id: tournamentId,
        round: round + 1,
        position: i,
        team1_id: teams[actualTeam1Index]?.id || null,
        team2_id: teams[actualTeam2Index]?.id || null,
        next_match_id: null,
        points_team1: 0,
        points_team2: 0,
      });
    }
  }

  return matches;
}

export function assignGroups(teams: Team[]): TournamentTeam[] {
  const shuffledTeams = shuffleArray([...teams]);
  return shuffledTeams.map((team, index) => ({
    ...team,
    group: index < teams.length / 2 ? 'A' : 'B',
  }));
}

export function generateGroupStageMatches(
  teams: TournamentTeam[],
  tournamentId: string
) {
  const matches = [];
  const groupA = teams.filter((t) => t.group === 'A');
  const groupB = teams.filter((t) => t.group === 'B');

  // Generate matches for Group A
  for (let i = 0; i < groupA.length; i++) {
    for (let j = i + 1; j < groupA.length; j++) {
      matches.push({
        tournament_id: tournamentId,
        round: 1, // Group stage is round 1
        position: matches.length,
        team1_id: groupA[i].id,
        team2_id: groupA[j].id,
        group: 'A',
        next_match_id: null,
        points_team1: 0,
        points_team2: 0,
      });
    }
  }

  // Generate matches for Group B
  for (let i = 0; i < groupB.length; i++) {
    for (let j = i + 1; j < groupB.length; j++) {
      matches.push({
        tournament_id: tournamentId,
        round: 1,
        position: matches.length,
        team1_id: groupB[i].id,
        team2_id: groupB[j].id,
        group: 'B',
        next_match_id: null,
        points_team1: 0,
        points_team2: 0,
      });
    }
  }

  // Generate semifinal matches (1st of A vs 2nd of B, 1st of B vs 2nd of A)
  matches.push(
    {
      tournament_id: tournamentId,
      round: 2,
      position: 0,
      team1_id: null, // Will be filled after group stage
      team2_id: null,
      group: 'SF1',
      next_match_id: null,
    },
    {
      tournament_id: tournamentId,
      round: 2,
      position: 1,
      team1_id: null,
      team2_id: null,
      group: 'SF2',
      next_match_id: null,
    }
  );

  // Generate final match
  matches.push({
    tournament_id: tournamentId,
    round: 3,
    position: 0,
    team1_id: null,
    team2_id: null,
    group: 'F',
    next_match_id: null,
  });

  return matches;
}
