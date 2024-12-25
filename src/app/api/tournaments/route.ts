import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Get query parameters from the URL
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Start the query
    let query = supabaseClient.from('tournaments').select(`
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
    const body = await request.json();

    // Debug logs
    console.log('Received format:', body.format);

    // Generate a UUID for the tournament
    const tournamentId = uuidv4();

    const { data: tournament, error } = await supabaseClient
      .from('tournaments')
      .insert({
        id: tournamentId,
        name: body.name,
        teams_limit: body.teams_limit,
        category: body.category,
        start_date: body.start_date,
        end_date: body.end_date,
        price: body.price,
        sign_up_limit_date: body.sign_up_limit_date,
        players: body.players,
        teams: body.teams,
        format: body.format,
        status: body.status,
        current_registrations: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating tournament:', error);
      return NextResponse.json(
        { error: 'Error creating tournament', details: error.message },
        { status: 500 }
      );
    }

    // Debug log
    console.log('Created tournament:', tournament);

    return NextResponse.json(tournament);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to create tournament' },
      { status: 500 }
    );
  }
}
