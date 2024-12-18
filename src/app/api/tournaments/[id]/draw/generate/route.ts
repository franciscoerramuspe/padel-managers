import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Fetch tournament and its teams
    const { data: tournament, error: tournamentError } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', params.id)
      .single();

    if (tournamentError) {
      console.error('Tournament fetch error:', tournamentError);
      throw tournamentError;
    }

    // 2. Extract and shuffle teams
    const teams = tournament.teams;
    if (!teams || !Array.isArray(teams)) {
      throw new Error(`Invalid teams data: ${JSON.stringify(teams)}`);
    }

    const shuffledTeams = shuffleArray([...teams]);

    // 3. Generate matches
    const matches = generateInitialMatches(shuffledTeams, params.id);

    // 4. Insert matches into database
    const { data: createdMatches, error: matchError } = await supabase
      .from('tournament_matches')
      .insert(matches)
      .select();

    if (matchError) {
      console.error('Match creation error:', matchError);
      throw matchError;
    }

    // 5. Fetch matches with team details
    const { data: matchesWithTeams, error: fetchError } = await supabase
      .from('tournament_matches')
      .select('*')
      .eq('tournament_id', params.id)
      .order('round', { ascending: true })
      .order('position', { ascending: true });

    if (fetchError) {
      console.error('Error fetching matches:', fetchError);
      throw fetchError;
    }

    // 6. Enrich matches with team details
    const enrichedMatches = matchesWithTeams.map((match) => ({
      ...match,
      team1: tournament.teams.find((t: any) => t.id === match.team1_id),
      team2: tournament.teams.find((t: any) => t.id === match.team2_id),
    }));

    return NextResponse.json({
      success: true,
      matches: enrichedMatches,
    });
  } catch (error: any) {
    console.error('Error generating draw:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate tournament draw',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generateInitialMatches(teams: any[], tournamentId: string) {
  const matches = [];
  const numTeams = teams.length;
  const numRounds = Math.ceil(Math.log2(numTeams));

  console.log(
    `Generating matches for ${numTeams} teams across ${numRounds} rounds`
  );

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
