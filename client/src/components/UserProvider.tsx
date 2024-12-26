'use client'

import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import Sidebar from './Sidebar';
import { usePathname, useRouter } from 'next/navigation';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/';
  const hasFetchedUser = useRef(false);

  useEffect(() => {
    if (hasFetchedUser.current) return;
    hasFetchedUser.current = true;

    const fetchUserAndRole = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
          console.error('Error fetching user:', error);
          setIsLoading(false);
          return;
        }

        if (user) {
          setUsername(user.user_metadata?.full_name || user.email || '');

          const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single();

          if (roleError) {
            console.error('Role fetch error:', roleError);
            setIsLoading(false);
            return;
          }

          setUserRole(roleData?.role || null);

          if (roleData?.role !== 'admin' && roleData?.role !== 'owner' && !isLoginPage) {
            setIsLoading(false);
            router.push('/unauthorized');
            return;
          }
        } else {
          setIsLoading(false);
          if (!isLoginPage) {
            router.push('/');
          }
        }
      } catch (error) {
        console.error('Error in fetchUserAndRole:', error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndRole();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUsername(session.user.user_metadata?.full_name || session.user.email || '');
        supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single()
          .then(({ data: roleData }) => {
            setUserRole(roleData?.role || null);
          });
      } else if (event === 'SIGNED_OUT') {
        setUsername(null);
        setUserRole(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [isLoginPage, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isLoginPage && userRole !== 'admin' && userRole !== 'owner') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Acceso no autorizado</h1>
          <p className="text-gray-600 mb-8">No tienes permisos para acceder a esta sección.</p>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/');
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar username={username || ''} userRole={userRole || ''} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
