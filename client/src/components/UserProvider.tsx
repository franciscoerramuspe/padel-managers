'use client'

import { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/';

  // Verificar el estado de autenticación
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Invalid token');
      }

      const data = await response.json();
      if (data.first_name) {
        setUsername(data.first_name);
      } else {
        throw new Error('Invalid user data');
      }
    } catch (error) {
      // Si hay cualquier error, limpiamos todo
      localStorage.removeItem('adminToken');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('userName');
      setUsername('');
      
      if (!isLoginPage) {
        router.push('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    
    // Agregar listener para eventos de storage para manejar logout en múltiples pestañas
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'adminToken' && !e.newValue) {
        router.push('/');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar username={username} />
        <main className="flex-1 transition-all duration-300 ease-in-out">
          {children}
        </main>
      </div>
    );
  }
  return children;
}
