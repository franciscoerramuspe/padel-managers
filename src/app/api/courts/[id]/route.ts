import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { error } = await supabase.from('courts').delete().eq('id', id);

    if (error) throw error;

    return NextResponse.json(
      { message: 'Court deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting court:', error);
    return NextResponse.json(
      { error: 'Failed to delete court' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const courtData = await request.json();

    const { data, error } = await supabase
      .from('courts')
      .update({
        name: courtData.name,
        type: courtData.type,
        court_size: courtData.court_size,
        hourly_rate: courtData.hourly_rate,
        image: courtData.image,
        // Supabase will handle the JSONB conversion
        availability: courtData.availability || [],
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating court:', error);
    return NextResponse.json(
      { error: 'Failed to update court' },
      { status: 500 }
    );
  }
}
