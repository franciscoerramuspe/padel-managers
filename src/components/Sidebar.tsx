"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaHome, FaCalendarAlt, FaUsers, FaCog, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { GiTennisCourt } from 'react-icons/gi';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface SidebarProps {
  username: string;
}

const Sidebar: React.FC<SidebarProps> = ({ username }) => {
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const menuItems = [
    { icon: FaHome, text: 'Inicio', href: '/dashboard' },
    { icon: GiTennisCourt, text: 'Canchas', href: '/courts' },
    { icon: FaCalendarAlt, text: 'Reservas', href: '/bookings', badge: '10 Reservas' },
    { icon: FaUsers, text: 'Usuarios', href: '/users' },
    { icon: FaCog, text: 'Configuraciones', href: '/settings' },
  ];

  return (
    <div className="bg-white text-gray-700 w-64 min-h-screen flex flex-col justify-between p-4 shadow-lg">
      <div>
        <div className="flex items-center mb-4 p-2 bg-gray-100 rounded-lg">
          <div className="w-10 h-10 bg-blue-500 rounded-full mr-3 flex items-center justify-center">
            <FaUser className="text-white text-xl" />
          </div>
          <div>
            <p className="font-bold text-sm">Bienvenido, {username.split(' ')[0]} <span className="text-blue-500"></span></p>
          </div>
        </div>
        <div className="mb-4 bg-blue-100 rounded-lg overflow-hidden shadow-md">
        {/* Aca va la imagen desde el BE */}
          <Image
            src="/assets/tercer-tiempo.png"
            alt="Tercer Tiempo"
            width={200}
            height={105}
            layout="responsive"
            className="object-cover"
          />
          <div className="p-3">
            <h3 className="text-lg font-semibold text-black">Club:</h3>
            <p className="text-sm text-black">Tercer Tiempo</p> {/* Aca va el nombre del club desde el BE */}
          </div>
        </div>
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link href={item.href}>
                  <div
                    className={`flex items-center p-2 rounded-lg transition-all duration-300 ease-in-out ${
                      hoveredItem === item.text
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                    onMouseEnter={() => setHoveredItem(item.text)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <item.icon
                      className={`mr-3 text-lg ${
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
      </div>

      <div className="mb-4">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-2 text-sm font-medium bg-orange-300 text-white rounded-lg hover:bg-gray-100 transition-colors duration-300"
        >
          <FaSignOutAlt className="mr-3 text-white" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
