import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { randomUUID } from 'crypto';
import { TournamentTimeConstraint } from '@/types/tournament';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters from the URL
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Start the query
    let query = supabase.from('tournaments').select(`
          *,
          tournament_time_constraints (*)
        `);

    // Add date filters if they exist
    if (startDate) {
      query = query.gte('start_date', startDate);
    }
    if (endDate) {
      query = query.lte('end_date', endDate);
    }

    // Execute the query with ordering
    const { data: tournaments, error } = await query.order('start_date', {
      ascending: true,
    });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return NextResponse.json(tournaments);
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tournaments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const tournamentData = await request.json();
    console.log('Received tournament data:', tournamentData); // Debug log

    // Start a Supabase transaction
    const { data: tournament, error: tournamentError } = await supabase
      .from('tournaments')
      .insert([
        {
          id: randomUUID(),
          players: tournamentData.players,
          teams: tournamentData.teams,
          teams_limit: tournamentData.teams_limit,
          current_registrations: 0,
          category: tournamentData.category,
          start_date: tournamentData.start_date,
          end_date: tournamentData.end_date,
          price: tournamentData.price,
          sign_up_limit_date: tournamentData.sign_up_limit_date,
        },
      ])
      .select()
      .single();

    if (tournamentError) {
      console.error('Supabase tournament error:', tournamentError);
      throw tournamentError;
    }

    // If there are time constraints, insert them
    if (
      tournamentData.time_constraints &&
      tournamentData.time_constraints.length > 0
    ) {
      const timeConstraintsData = tournamentData.time_constraints.map(
        (constraint: TournamentTimeConstraint) => ({
          id: randomUUID(),
          tournament_id: tournament.id,
          team_id: constraint.team_id,
          start_time: constraint.start_time,
          end_time: constraint.end_time,
        })
      );

      const { error: constraintsError } = await supabase
        .from('tournament_time_constraints')
        .insert(timeConstraintsData);

      if (constraintsError) {
        console.error('Supabase time constraints error:', constraintsError);
        throw constraintsError;
      }
    }

    console.log('Created tournament data:', tournament);
    return NextResponse.json(tournament);
  } catch (error) {
    console.error('Error creating tournament:', error);
    return NextResponse.json(
      { error: 'Failed to create tournament' },
      { status: 500 }
    );
  }
}
