"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  HomeIcon,
  UsersIcon,
  Cog6ToothIcon as CogIcon,
  TrophyIcon,
  ArrowRightOnRectangleIcon as LogoutIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  ChartBarIcon,
  PhotoIcon as ImageIcon,
  BanknotesIcon,
  PlusIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline';
import { ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Image from 'next/image';
import LoadingScreen from './LoadingScreen';

interface MenuItem {
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<any>;
  iconColor?: string;
  hoverColor?: string;
  submenu?: {
    name: string;
    href: string;
    icon: React.ForwardRefExoticComponent<any>;
    iconColor?: string;
    textColor?: string;
  }[];
}

const MENU_ITEMS: MenuItem[] = [
  { 
    name: 'Inicio', 
    href: '/dashboard', 
    icon: HomeIcon,
    iconColor: 'text-blue-500',
    hoverColor: 'hover:bg-blue-50'
  },
  { 
    name: 'Torneos', 
    href: '/tournaments', 
    icon: TrophyIcon,
    iconColor: 'text-indigo-500',
    hoverColor: 'hover:bg-indigo-50',
    submenu: [
      { 
        name: 'Ver torneos', 
        href: '/tournaments', 
        icon: TrophyIcon,
        iconColor: 'text-indigo-500' 
      },
      { 
        name: 'Crear torneo', 
        href: '/tournaments/create', 
        icon: PlusIcon,
        iconColor: 'text-emerald-500',
        textColor: 'text-emerald-600 font-medium'
      },
      { 
        name: 'Inscripciones', 
        href: '/payments', 
        icon: BanknotesIcon,
        iconColor: 'text-amber-500'
      },
      { 
        name: 'Canchas', 
        href: '/courts', 
        icon: TrophyIcon,
        iconColor: 'text-purple-500'
      },
    ]
  },
  { 
    name: 'Ligas', 
    href: '/leagues', 
    icon: TableCellsIcon,
    iconColor: 'text-purple-500',
    hoverColor: 'hover:bg-purple-50',
    submenu: [
      { 
        name: 'Ver ligas', 
        href: '/leagues', 
        icon: TableCellsIcon,
        iconColor: 'text-purple-500' 
      },
      { 
        name: 'Crear liga', 
        href: '/leagues/create', 
        icon: PlusIcon,
        iconColor: 'text-emerald-500',
        textColor: 'text-emerald-600 font-medium'
      }
    ]
  },
  { 
    name: 'Usuarios', 
    href: '/users', 
    icon: UsersIcon,
    iconColor: 'text-cyan-500',
    hoverColor: 'hover:bg-cyan-50'
  },
  { 
    name: 'Patrocinadores', 
    href: '/sponsors', 
    icon: ImageIcon,
    iconColor: 'text-pink-500',
    hoverColor: 'hover:bg-pink-50'
  },
  { 
    name: 'Estadisticas', 
    href: '/incomes', 
    icon: ChartBarIcon,
    iconColor: 'text-orange-500',
    hoverColor: 'hover:bg-orange-50'
  },
  { 
    name: 'Configuraciones', 
    href: '/settings', 
    icon: CogIcon,
    iconColor: 'text-gray-500',
    hoverColor: 'hover:bg-gray-50'
  },

];

const MenuItem = ({ 
  item, 
  isHovered, 
  onHover,
  isSubmenuOpen,
  onToggleSubmenu 
}: { 
  item: MenuItem;
  isHovered: boolean;
  onHover: (name: string | null) => void;
  isSubmenuOpen: boolean;
  onToggleSubmenu: () => void;
}) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (item.submenu) {
      onToggleSubmenu();
    } else {
      router.push(item.href);
    }
  };

  return (
    <div>
      <div
        className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 ease-in-out cursor-pointer
          ${isHovered || isSubmenuOpen 
            ? 'bg-gradient-to-r from-gray-50 to-gray-50/50' 
            : item.hoverColor || 'hover:bg-gray-50'
          }
        `}
        onMouseEnter={() => onHover(item.name)}
        onMouseLeave={() => onHover(null)}
        onClick={handleClick}
      >
        <div className="flex items-center">
          <item.icon
            className={`w-5 h-5 mr-3 transition-colors ${item.iconColor || 'text-gray-400'}`}
          />
          <span className="text-sm font-medium text-gray-700">
            {item.name}
          </span>
        </div>
        {item.submenu && (
          <ChevronDown 
            className={`w-4 h-4 transition-transform duration-200 text-gray-400
              ${isSubmenuOpen ? 'rotate-180' : ''}`} 
          />
        )}
      </div>
      
      {item.submenu && (
        <div className={`ml-4 mt-1 space-y-1 overflow-hidden transition-all duration-200
          ${isSubmenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          {item.submenu.map((subItem) => (
            <Link 
              key={subItem.href} 
              href={subItem.href}
              className="flex items-center p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <subItem.icon className={`w-4 h-4 mr-2 ${subItem.iconColor || 'text-gray-400'}`} />
              <span className={`text-sm ${subItem.textColor || ''}`}>
                {subItem.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const LogoCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 transform transition-all duration-300 hover:shadow-xl">
    <div className="relative w-full h-36 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center p-4">
      <div className="relative w-28 h-28 bg-white rounded-full p-2 shadow-lg ring-4 ring-white/50 transform transition-transform duration-300 hover:scale-105">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-white rounded-full animate-pulse-slow" />
        <Image
          src="/assets/recrealogo.jpeg"
          alt="Recrea Padel Club"
          fill
          priority
          sizes="(max-width: 768px) 112px, 112px"
          className="object-contain p-2 rounded-full relative z-10"
          style={{ 
            objectFit: 'contain',
            background: 'white',
          }}
        />
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full blur opacity-30 group-hover:opacity-40 animate-tilt" />
      </div>
    </div>
    <div className="p-5 bg-white">
      <h3 className="text-sm font-semibold text-gray-700 mb-1">Club:</h3>
      <p className="text-base font-medium bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
        Recrea Padel Club
      </p>
    </div>
  </div>
);

interface SidebarProps {
  username?: string;
}

const Sidebar = ({ username }: SidebarProps) => {
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

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
      await supabase.auth.signOut();
      localStorage.removeItem('adminToken');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('userName');
      
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

      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push('/');
      window.location.reload();
    } catch (error) {
      console.error('Error durante el cierre de sesión:', error);
      localStorage.clear();
      router.push('/');
    }
  };

  const userName = localStorage.getItem('userName');

  const handleSubmenuToggle = (itemName: string) => {
    setOpenSubmenu(openSubmenu === itemName ? null : itemName);
  };

  return (
    <>
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
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-40 w-[85%] md:w-64 bg-white h-screen transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full max-h-screen">
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
            
            <LogoCard />
          </div>

          {/* Navigation Section */}
          <nav className="flex-1 p-4 overflow-y-auto md:overflow-visible">
            <ul className="space-y-2">
              {MENU_ITEMS.map((item) => (
                <li key={item.name}>
                  <MenuItem 
                    item={item} 
                    isHovered={hoveredItem === item.name}
                    onHover={setHoveredItem}
                    isSubmenuOpen={openSubmenu === item.name}
                    onToggleSubmenu={() => handleSubmenuToggle(item.name)}
                  />
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto p-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-3 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors group"
            >
              <LogoutIcon className="w-5 h-5 mr-3 text-red-500 group-hover:text-red-600" />
              <span className="font-medium">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;