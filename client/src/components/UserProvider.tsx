'use client'

import { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { UserContext } from '../contexts/UserContext';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState<string>('');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const hasFetchedUser = useRef(false);
  const pathname = usePathname();
  const isLoginPage = pathname === '/';

  useEffect(() => {
    if (hasFetchedUser.current) return;
    hasFetchedUser.current = true;

    const fetchUserAndRole = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          setIsLoading(false);
          if (!isLoginPage) {
            router.push('/');
          }
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        
        if (data.user) {
          setUsername(data.profile.nombre || data.user.email || '');
          const userRole = data.user.user_metadata?.role;
          setUserRole(userRole);

          if (userRole !== 'admin' && userRole !== 'owner' && !isLoginPage) {
            setIsLoading(false);
            router.push('/unauthorized');
            return;
          }
        } else {
          if (!isLoginPage) {
            router.push('/');
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('isAdmin');
        if (!isLoginPage) {
          router.push('/');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndRole();
  }, [router, isLoginPage]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <UserContext.Provider value={{ username, userRole }}>
      {children}
    </UserContext.Provider>
  );
}
