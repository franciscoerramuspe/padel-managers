'use client'

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Sidebar from './Sidebar';

export default function UserProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUsername(user.user_metadata?.full_name || user.email || '');
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex">
      <Sidebar username={username} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
