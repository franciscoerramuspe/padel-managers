"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaHome, FaCalendarAlt, FaUsers, FaCog, FaSignOutAlt, FaUser, FaCalendarCheck, FaChartLine, FaBars, FaTimes } from 'react-icons/fa';
import { GiTennisCourt } from 'react-icons/gi';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

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
    await supabase.auth.signOut();
    router.push('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const menuItems = [
    { icon: FaHome, text: 'Inicio', href: '/dashboard' },
    { icon: GiTennisCourt, text: 'Canchas', href: '/courts' },
    { icon: FaCalendarAlt, text: 'Reservas', href: '/bookings', badge: '10 Reservas' },
    { icon: FaCalendarCheck, text: 'Calendario de reservas', href: '/booking-calendar' },
    { icon: FaUsers, text: 'Usuarios', href: '/users' },
    { icon: FaCog, text: 'Configuraciones', href: '/settings' },
    {
      text: 'Ingresos',
      href: '/incomes',
      icon: FaChartLine,
      badge: null,
    },
  ];

  return (
    <>
      {/* Hamburger Menu Button - Only visible on mobile */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white shadow-lg text-blue-500 hover:bg-blue-50 transition-colors"
      >
        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Overlay for mobile menu */}
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
                  Bienvenido, {username?.split(' ')[0] || 'Usuario'}
                </p>
              </div>
            </div>
            
            <div className="bg-blue-400 rounded-xl overflow-hidden shadow-sm">
              <Image
                src="/assets/tercer-tiempo.png"
                alt="Tercer Tiempo"
                width={180}
                height={105}
                layout="responsive"
                className="object-fill"
              />
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-700">Club:</h3>
                <p className="text-sm font-medium text-gray-700">Tercer Tiempo</p>
              </div>
            </div>
          </div>

          {/* Navigation Section */}
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
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
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer Section */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-3 text-sm font-medium text-white bg-orange-400 rounded-xl hover:bg-orange-500 transition-colors duration-300"
            >
              <FaSignOutAlt className="mr-3" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
