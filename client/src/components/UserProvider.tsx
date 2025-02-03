'use client'

import { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState<string>('');
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
        if (data.first_name) {
          setUsername(data.first_name);
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

  // Si es la página de login, no mostramos el sidebar
  if (isLoginPage) {
    return children;
  }

  // Si el usuario está autenticado, mostramos el layout con sidebar
  if (username) {
    return (
      <div className="flex min-h-screen">
        <Sidebar username={username} />
        <main className="flex-1 ml-0 md:ml-64 transition-margin duration-300 ease-in-out">
          {children}
        </main>
      </div>
    );
  }

  // Si no hay usuario y no es la página de login, redirigimos
  if (!isLoginPage) {
    router.push('/');
  }

  return children;
}
