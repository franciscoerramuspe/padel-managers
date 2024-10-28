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
