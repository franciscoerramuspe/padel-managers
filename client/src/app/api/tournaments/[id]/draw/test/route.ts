import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Get tournament data
    const { data: tournament, error: tournamentError } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', params.id)
      .single();

    if (tournamentError) throw tournamentError;

    // 2. Get tournament matches
    const { data: matches, error: matchesError } = await supabase
      .from('tournament_matches')
      .select('*')
      .eq('tournament_id', params.id)
      .order('round', { ascending: true })
      .order('position', { ascending: true });

    if (matchesError) throw matchesError;

    // 3. Return structured data for verification
    return NextResponse.json({
      tournament: {
        id: tournament.id,
        name: tournament.name,
        teams: tournament.teams,
      },
      matches: matches.map((match) => ({
        ...match,
        team1: tournament.teams.find((t: any) => t.id === match.team1_id),
        team2: tournament.teams.find((t: any) => t.id === match.team2_id),
      })),
      matchStructure: {
        totalMatches: matches.length,
        roundsCount: Math.max(...matches.map((m) => m.round)),
        matchesByRound: matches.reduce((acc: any, match) => {
          acc[match.round] = (acc[match.round] || 0) + 1;
          return acc;
        }, {}),
      },
    });
  } catch (error) {
    console.error('Error testing draw:', error);
    return NextResponse.json({ error: 'Failed to test draw' }, { status: 500 });
  }
}
