"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaHome, FaCalendarAlt, FaUsers, FaCog, FaSignOutAlt, FaUser, FaChartLine, FaBars, FaTimes, FaWhatsapp, FaTrophy } from 'react-icons/fa';
import { GiTennisCourt } from 'react-icons/gi';
import { supabase } from '../lib/supabase';
import Image from 'next/image';
import { ClientSideWrapper } from './ClientSideWrapper';

interface SidebarProps {
  username?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ username }) => {
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

      // 4. Limpiamos cualquier estado global si existe

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

  const menuItems = [
    { icon: FaHome, text: 'Inicio', href: '/dashboard' },
    { icon: GiTennisCourt, text: 'Canchas', href: '/courts' },
    { icon: FaCalendarAlt, text: 'Reservas', href: '/bookings', badge: '10 Reservas' },
    { icon: FaChartLine, text: 'Ingresos', href: '/incomes' },
    { icon: FaUsers, text: 'Usuarios', href: '/users' },
    { icon: FaCog, text: 'Configuraciones', href: '/settings' },
    { icon: FaTrophy, text: 'Torneos', href: '/tournaments' },
    {
      icon: FaSignOutAlt,
      text: 'Cerrar sesión',
      href: '#',
      isAction: true,
      onClick: handleLogout,
      className: 'bg-orange-400 text-white hover:bg-orange-500'
    },
    {
      icon: FaWhatsapp,
      text: 'Soporte',
      href: 'https://wa.me/59892033831',
      isAction: true,
      isExternal: true,
      className: 'bg-green-500 text-white hover:bg-green-600'
    }
  ];

  const userName = localStorage.getItem('userName');

  return (
    <ClientSideWrapper>
      {/* Hamburger Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white shadow-lg text-blue-500 hover:bg-blue-50 transition-colors"
      >
        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
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
        className={`fixed md:static inset-y-0 left-0 z-40 w-[85%] md:w-64 bg-white min-h-screen transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header Section */}
          <div className="p-4 bg-blue-50 rounded-b-2xl">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-full mr-3 flex items-center justify-center">
                <FaUser className="text-white text-xl" />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-700">
                  Bienvenido, {userName?.split(' ')[0] || 'Usuario'}
                </p>
              </div>
            </div>
            
            <div className="bg-blue-400 rounded-xl overflow-hidden shadow-sm">
              <Image
                src="/assets/tercer-tiempo.png"
                alt="Tercer Tiempo"
                width={180}
                height={105}
                className="object-fill"
              />
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-700">Club:</h3>
                <p className="text-sm font-medium text-gray-700">Tercer Tiempo</p>
              </div>
            </div>
          </div>

          {/* Navigation Section */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  {item.isAction ? (
                    <button
                      onClick={item.onClick}
                      className={`flex items-center w-full p-3 rounded-xl transition-all duration-300 ${item.className}`}
                    >
                      <item.icon className="mr-3" />
                      <span className="text-sm font-medium">{item.text}</span>
                    </button>
                  ) : item.isExternal ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center w-full p-3 rounded-xl transition-all duration-300 ${item.className}`}
                    >
                      <item.icon className="mr-3" />
                      <span className="text-sm font-medium">{item.text}</span>
                    </a>
                  ) : (
                    <Link href={item.href}>
                      <div
                        className={`flex items-center p-3 rounded-xl text-gray-800 transition-all duration-300 ease-in-out ${
                          hoveredItem === item.text
                            ? 'bg-blue-500 text-white'
                            : 'hover:bg-gray-100'
                        }`}
                        onMouseEnter={() => setHoveredItem(item.text)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        <item.icon
                          className={`mr-3 text-xl ${
                            hoveredItem === item.text ? 'text-white' : 'text-gray-500'
                          }`}
                        />
                        <span className="text-sm font-medium">{item.text}</span>
                        {item.badge && (
                          <span className="ml-auto bg-blue-100 text-blue-500 text-xs font-semibold px-2 py-1 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </ClientSideWrapper>
  );
};

export default Sidebar;
