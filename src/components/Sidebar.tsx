import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaHome, FaCalendarAlt, FaUsers, FaCog, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { GiTennisCourt } from 'react-icons/gi';
import { supabase } from '@/lib/supabase';

const Sidebar = () => {
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const menuItems = [
    { icon: FaHome, text: 'Dashboard', href: '/dashboard' },
    { icon: GiTennisCourt, text: 'Courts', href: '/courts' },
    { icon: FaCalendarAlt, text: 'Reservations', href: '/reservations' },
    { icon: FaUsers, text: 'Users', href: '/users' },
    { icon: FaCog, text: 'Settings', href: '/settings' },
  ];

  return (
    <div className="bg-gradient-to-b from-blue-500 to-blue-700 text-white w-64 min-h-screen flex flex-col justify-between p-4 shadow-lg">
      <div>
        <h1 className="text-2xl font-bold mb-8 text-center">Padel Manager</h1>
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link href={item.href}>
                  <div
                    className={`flex items-center p-3 rounded-full transition-all duration-300 ease-in-out ${
                      hoveredItem === item.text
                        ? 'bg-white text-blue-600'
                        : 'hover:bg-blue-600'
                    }`}
                    onMouseEnter={() => setHoveredItem(item.text)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <item.icon className={`mr-3 text-l  ${
                      hoveredItem === item.text ? 'text-blue-600' : 'text-white'
                    }`} />
                    <span className="text-lg font-semibold">{item.text}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mt-auto">
        <div className="flex items-center mb-4 p-3 bg-blue-600 rounded-lg">
          <div className="w-12 h-12 bg-gray-300 rounded-full mr-3 flex items-center justify-center">
            <FaUser className="text-blue-600 text-xl" />
          </div>
          <div>
            <p className="font-semibold">Hola!</p>
            <p className="text-sm">{'{username}'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full font-semibold p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300"
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
