export const generateInitialMatches = (teams: any[], tournamentId: string) => {
  const matches = [];
  const numTeams = teams.length;
  const numRounds = Math.ceil(Math.log2(numTeams));

  // First round matches
  for (let i = 0; i < Math.floor(numTeams / 2); i++) {
    matches.push({
      id: crypto.randomUUID(),
      tournament_id: tournamentId,
      round: 1,
      position: i + 1,
      team1_id: teams[i * 2].id,
      team2_id: teams[i * 2 + 1]?.id || null,
    });
  }

  // Create subsequent rounds
  for (let round = 2; round <= numRounds; round++) {
    const matchesInRound = Math.pow(2, numRounds - round);
    for (let i = 0; i < matchesInRound; i++) {
      matches.push({
        id: crypto.randomUUID(),
        tournament_id: tournamentId,
        round: round,
        position: i + 1,
        team1_id: null,
        team2_id: null,
      });
    }
  }

  return matches;
};

export const generateRoundRobinMatches = (
  teams: any[],
  tournamentId: string
) => {
  const matches = [];
  const n = teams.length;
  const rounds = n - 1;
  const matchesPerRound = Math.floor(n / 2);

  let teamIndices = teams.map((_, index) => index);
  const firstTeam = teamIndices.shift();

  for (let round = 1; round <= rounds; round++) {
    for (let match = 0; match < matchesPerRound; match++) {
      const team1Index = match === 0 ? firstTeam : teamIndices[match - 1];
      const team2Index = teamIndices[teamIndices.length - match];

      matches.push({
        id: crypto.randomUUID(),
        tournament_id: tournamentId,
        round: round,
        position: match + 1,
        team1_id: teams[team1Index!].id,
        team2_id: teams[team2Index!].id,
      });
    }
    teamIndices.push(teamIndices.shift()!);
  }

  return matches;
};

export const assignGroups = (teams: any[]) => {
  const shuffledTeams = [...teams].sort(() => Math.random() - 0.5);
  const halfLength = Math.ceil(teams.length / 2);

  return shuffledTeams.map((team, index) => ({
    ...team,
    group: index < halfLength ? 'A' : 'B',
  }));
};

export const generateGroupStageMatches = (
  teams: any[],
  tournamentId: string
) => {
  const matches: any[] = [];
  const groupATeams = teams.filter((t) => t.group === 'A');
  const groupBTeams = teams.filter((t) => t.group === 'B');

  // Generate matches for each group
  const groupAMatches = generateRoundRobinForGroup(
    groupATeams,
    tournamentId,
    'A'
  );
  const groupBMatches = generateRoundRobinForGroup(
    groupBTeams,
    tournamentId,
    'B'
  );

  // Add all group matches (round 1)
  matches.push(...groupAMatches, ...groupBMatches);

  // Add semifinals (round 2)
  matches.push(
    {
      id: crypto.randomUUID(),
      tournament_id: tournamentId,
      round: 2,
      position: 1,
      team1_id: null, // Will be winner of Group A
      team2_id: null, // Will be runner-up of Group B
      group: null,
    },
    {
      id: crypto.randomUUID(),
      tournament_id: tournamentId,
      round: 2,
      position: 2,
      team1_id: null, // Will be winner of Group B
      team2_id: null, // Will be runner-up of Group A
      group: null,
    }
  );

  // Add final (round 3)
  matches.push({
    id: crypto.randomUUID(),
    tournament_id: tournamentId,
    round: 3,
    position: 1,
    team1_id: null,
    team2_id: null,
    group: null,
  });

  return matches;
};

const generateRoundRobinForGroup = (
  teams: any[],
  tournamentId: string,
  group: string
) => {
  const matches = [];
  const n = teams.length;
  const rounds = n - 1;
  const matchesPerRound = Math.floor(n / 2);

  let teamIndices = teams.map((_, index) => index);
  const firstTeam = teamIndices.shift();

  for (let round = 1; round <= rounds; round++) {
    for (let match = 0; match < matchesPerRound; match++) {
      const team1Index = match === 0 ? firstTeam : teamIndices[match - 1];
      const team2Index = teamIndices[teamIndices.length - match];

      matches.push({
        id: crypto.randomUUID(),
        tournament_id: tournamentId,
        round: 1,
        position: matches.length + 1,
        team1_id: teams[team1Index!].id,
        team2_id: teams[team2Index!].id,
        group: group,
      });
    }
    teamIndices.push(teamIndices.shift()!);
  }

  return matches;
};
