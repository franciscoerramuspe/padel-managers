import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  generateInitialMatches,
  generateRoundRobinMatches,
  assignGroups,
  generateGroupStageMatches,
} from '../../../../../../utils/tournament-utils';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: tournament, error: tournamentError } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', params.id)
      .single();

    if (tournamentError) throw tournamentError;

    let teams = tournament.teams;
    let matches;

    console.log('Tournament format:', tournament.format);

    switch (tournament.format) {
      case 'group_stage':
        teams = assignGroups(teams);
        matches = generateGroupStageMatches(teams, params.id);
        await supabase
          .from('tournaments')
          .update({ teams })
          .eq('id', params.id);
        break;

      case 'round_robin':
        matches = generateRoundRobinMatches(teams, params.id);
        break;

      case 'single_elimination':
      default:
        matches = generateInitialMatches(teams, params.id);
        break;
    }

    const { data: createdMatches, error: matchError } = await supabase
      .from('tournament_matches')
      .insert(matches)
      .select();

    if (matchError) throw matchError;

    return NextResponse.json({
      success: true,
      matches: createdMatches.map((match) => ({
        ...match,
        team1: teams.find((t) => t.id === match.team1_id),
        team2: teams.find((t) => t.id === match.team2_id),
      })),
    });
  } catch (error: any) {
    console.error('Error generating draw:', error);
    return NextResponse.json(
      { error: 'Failed to generate tournament draw', details: error.message },
      { status: 500 }
    );
  }
}
