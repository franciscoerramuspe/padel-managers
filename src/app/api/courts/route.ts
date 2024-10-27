import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

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
    const body = await request.json();
    const { name, type, availability, iscovered } = body;

    // Validación básica
    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      );
    }

    // Inserta la nueva cancha en la base de datos
    const { data, error } = await supabase
      .from('courts')
      .insert({
        name,
        type,
        availability,
        iscovered,
      })
      .select();

    if (error) throw error;

    return NextResponse.json(data?.[0] || {}, { status: 201 });
  } catch (error) {
    console.error('Error inserting new court:', error);
    return NextResponse.json(
      { error: 'Failed to insert new court' },
      { status: 500 }
    );
  }
}
