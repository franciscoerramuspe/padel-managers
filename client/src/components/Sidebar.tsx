"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  HomeIcon,
  CalendarIcon,
  UsersIcon,
  Cog6ToothIcon as CogIcon,
  TrophyIcon,
  ArrowRightOnRectangleIcon as LogoutIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { GiTennisCourt } from 'react-icons/gi';
import { supabase } from '../lib/supabase';
import Image from 'next/image';
import { ClientSideWrapper } from './ClientSideWrapper';
import LoadingScreen from './LoadingScreen';

interface SidebarProps {
  username?: string;
  
}

const menuItems = [
  { name: 'Inicio', href: '/dashboard', icon: HomeIcon },
  { name: 'Reservas', href: '/bookings', icon: CalendarIcon },
  { name: 'Usuarios', href: '/users', icon: UsersIcon },
  { name: 'Configuraciones', href: '/settings', icon: CogIcon },
  { name: 'Torneos', href: '/tournaments', icon: TrophyIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ username }) => {
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // 1. Primero hacemos el signOut en Supabase
      await supabase.auth.signOut();
      
      // 2. Limpiamos todo el localStorage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('userName');
      
      // 3. Llamada al backend para invalidar la sesión
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
      } catch (error) {
        console.error('Error al cerrar sesión en el backend:', error);
      }

      // 4. Agregamos un pequeño delay para mostrar la animación
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 5. Redirigimos al login
      router.push('/');
      
      // 6. Forzamos un reload para limpiar cualquier estado residual
      window.location.reload();
    } catch (error) {
      console.error('Error durante el cierre de sesión:', error);
      // Aún si hay error, intentamos limpiar todo
      localStorage.clear();
      router.push('/');
    }
  };

  const userName = localStorage.getItem('userName');

  return (
    <ClientSideWrapper>
      {isLoggingOut && <LoadingScreen message="Cerrando sesión..." />}
      
      {/* Hamburger Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white shadow-lg text-blue-500 hover:bg-blue-50 transition-colors"
      >
        {isMobileMenuOpen ? 
          <XMarkIcon className="w-6 h-6" /> : 
          <Bars3Icon className="w-6 h-6" />
        }
      </button>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <div
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-40 w-[85%] md:w-64 bg-white min-h-screen transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header Section with Logo */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-b-3xl shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-full mr-3 flex items-center justify-center">
                <UserIcon className="text-white text-xl" />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-700">
                  Bienvenido, {userName?.split(' ')[0] || 'Usuario'}
                </p>
              </div>
            </div>
            
            {/* Logo Card */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 transform transition-all duration-300 hover:shadow-xl">
              <div className="relative w-full h-36 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-[url('/assets/pattern.png')] opacity-10"></div>
                <div className="relative w-28 h-28 bg-white rounded-full p-2 shadow-lg ring-4 ring-white/50 transform transition-transform duration-300 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-white rounded-full animate-pulse-slow"></div>
                  <Image
                    src="/assets/recrealogo.jpeg"
                    alt="Recrea Padel Club"
                    fill
                    className="object-contain p-2 rounded-full relative z-10"
                    style={{ 
                      objectFit: 'contain',
                      background: 'white',
                    }}
                  />
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full blur opacity-30 group-hover:opacity-40 animate-tilt"></div>
                </div>
              </div>
              <div className="p-5 bg-white">
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Club:</h3>
                <p className="text-base font-medium bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Recrea Padel Club
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Section */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link href={item.href}>
                    <div
                      className={`flex items-center p-3 rounded-xl text-gray-800 transition-all duration-300 ease-in-out ${
                        hoveredItem === item.name
                          ? 'bg-blue-500 text-white'
                          : 'hover:bg-gray-100'
                      }`}
                      onMouseEnter={() => setHoveredItem(item.name)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <item.icon
                        className={`w-5 h-5 mr-3 ${
                          hoveredItem === item.name ? 'text-white' : 'text-gray-500'
                        }`}
                      />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogoutIcon className="w-5 h-5 mr-3" />
                  <span className="text-sm">Cerrar sesión</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </ClientSideWrapper>
  );
};

export default Sidebar;
