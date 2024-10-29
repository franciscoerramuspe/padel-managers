'use client'

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Sidebar from './Sidebar';
import { usePathname, useRouter } from 'next/navigation';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === '/';

  useEffect(() => {
    const fetchUserAndRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUsername(user.user_metadata?.full_name || user.email || '');
          
          // Fetch user role from your roles table
          const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single();

          if (roleError) throw roleError;
          
          setUserRole(roleData?.role || null);

          // Redirect non-admin/non-owner users
          if (roleData?.role !== 'admin' && roleData?.role !== 'owner' && !isLoginPage) {
            router.push('/unauthorized');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndRole();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUsername(session.user.user_metadata?.full_name || session.user.email || '');
        
        // Fetch role when user signs in
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        setUserRole(roleData?.role || null);
      } else if (event === 'SIGNED_OUT') {
        setUsername(null);
        setUserRole(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router, isLoginPage]);

  if (isLoading) {
    return <div>Loading...</div>; // Or your loading component
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show unauthorized message for non-admin/non-owner users
  if (!isLoginPage && userRole !== 'admin' && userRole !== 'owner') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Acceso no autorizado</h1>
          <p className="text-gray-600 mb-8">No tienes permisos para acceder a esta sección.</p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
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
