'use client'

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Sidebar from './Sidebar';

export default function UserProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUsername(user ? user.user_metadata?.full_name || user.email || '' : null);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUsername(session.user.user_metadata?.full_name || session.user.email || '');
      } else if (event === 'SIGNED_OUT') {
        setUsername(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="flex">
      <Sidebar username={username ?? ''} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
