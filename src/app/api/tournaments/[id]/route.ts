// app/api/tournaments/[id]/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log('Fetching tournament with ID:', id); // Debug log

    const { data: tournament, error } = await supabase
      .from('tournaments')
      .select(
        `
          *,
          tournament_time_constraints (*)
        `
      )
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Tournament not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    if (!tournament) {
      return NextResponse.json(
        { error: 'Tournament not found' },
        { status: 404 }
      );
    }

    console.log('Found tournament:', tournament); // Debug log
    return NextResponse.json(tournament);
  } catch (error) {
    console.error('Error fetching tournament:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tournament' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    console.log('Updating tournament with data:', body); // Debug log

    const { data: tournament, error } = await supabase
      .from('tournaments')
      .update({
        name: body.name,
        start_date: body.start_date,
        end_date: body.end_date,
        teams_limit: body.teams_limit,
        price: body.price,
        location: body.location,
        format: body.format,
        status: body.status,
        prize_pool: body.prize_pool,
        category: body.category,
        sign_up_limit_date: body.sign_up_limit_date,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Tournament not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    console.log('Tournament updated successfully:', tournament); // Debug log
    return NextResponse.json(tournament);
  } catch (error) {
    console.error('Error updating tournament:', error);
    return NextResponse.json(
      { error: 'Failed to update tournament' },
      { status: 500 }
    );
  }
}
