import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase.from('courts').select('*');

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching courts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const courtData = await request.json();
    console.log('Received court data:', courtData); // Debug log

    const { data, error } = await supabase
      .from('courts')
      .insert([
        {
          name: courtData.name,
          type: courtData.type,
          court_size: courtData.court_size || 'standard',
          hourly_rate: courtData.hourly_rate || 0,
          image: courtData.image || '',
          // Change to use availability instead of availableTimeSlots
          availability: courtData.availability || [],
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error); // Debug log
      throw error;
    }

    console.log('Created court data:', data); // Debug log
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating court:', error);
    return NextResponse.json(
      { error: 'Failed to create court' },
      { status: 500 }
    );
  }
}
