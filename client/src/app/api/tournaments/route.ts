import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('tournaments')
      .select(`
        *,
        tournament_teams (
          team_id,
          teams (*)
        ),
        tournament_info (*)
      `)
      .eq('status', 'upcoming')
      .order('start_date', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error fetching tournaments' }, { status: 500 });
  }
}
