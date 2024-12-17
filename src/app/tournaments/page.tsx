import React from 'react';
import { createClient } from '@/utils/supabase/server';

const TournamentsPage = async () => {
    const supabase = createClient();
    const { data: tournaments, error } = await supabase.from('tournaments').select('*').eq('status', 'active');

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Torneos</h1>
      </div>
    </>
  );
};

export default TournamentsPage;
