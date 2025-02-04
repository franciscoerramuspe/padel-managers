'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CalendarIcon, UsersIcon, ChartBarIcon,ScaleIcon, ClockIcon} from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';
import { useUsers } from '@/hooks/useUsers';


// Lazy load de componentes grandes
const ActiveUsers = dynamic(() => import('../../components/Dashboard/ActiveUsers'), {
  loading: () => <div className="animate-pulse bg-gray-100 h-64 rounded-xl"></div>,
  ssr: false
});

const quickStats = [
  { 
    title: 'Reservas Hoy', 
    value: '12', 
    icon: CalendarIcon,
    color: 'bg-gradient-to-r from-blue-400 to-blue-600',
    hover: 'hover:from-blue-500 hover:to-blue-700',
    iconBg: 'bg-blue-400/30',
    href: '/bookings'
  },
  { 
    title: 'Usuarios Registrados', 
    value: '45', 
    icon: UsersIcon,
    color: 'bg-gradient-to-r from-purple-400 to-purple-600',
    hover: 'hover:from-purple-500 hover:to-purple-700',
    iconBg: 'bg-purple-400/30',
    href: '/users'
  },
  { 
    title: 'Canchas Registradas', 
    value: '8', 
    icon: ScaleIcon,
    color: 'bg-gradient-to-r from-orange-400 to-orange-600',
    hover: 'hover:from-orange-500 hover:to-orange-700',
    iconBg: 'bg-orange-400/30',
    href: '/courts'
  },
  { 
    title: 'Ingresos del Día', 
    value: '$1,250', 
    icon: ChartBarIcon,
    color: 'bg-gradient-to-r from-green-400 to-green-600',
    hover: 'hover:from-green-500 hover:to-green-700',
    iconBg: 'bg-green-400/30',
    href: '/finances'
  },
];

const courts = [
  { 
    id: 1, 
    name: 'Cancha Gatorade', 
    status: 'Disponible',
    image: '/assets/images.jpg',
    nextAvailable: '14:00',
    type: 'padel'
  },
  { 
    id: 2, 
    name: 'Cancha Powerade', 
    status: 'Ocupada',
    image: '/assets/images.jpg',
    nextAvailable: '16:30',
    type: 'padel'
  },
  { 
    id: 3, 
    name: 'Cancha Red Bull', 
    status: 'Mantenimiento',
    image: '/assets/futbol.jpg',
    nextAvailable: '18:00',
    type: 'football'
  },
];

const upcomingReservations = [
  { 
    id: 1, 
    court: 'Cancha Gatorade',
    time: '14:00 - 15:00',
    players: ['John Doe', 'Jane Smith'],
    type: 'padel'
  },
  { 
    id: 2, 
    court: 'Cancha Powerade',
    time: '15:00 - 16:00',
    players: ['Mike Johnson', 'Sarah Brown'],
    type: 'padel'
  },
  { 
    id: 3, 
    court: 'Cancha Red Bull',
    time: '16:00 - 17:00',
    players: ['Alex Wilson', 'Emma Davis'],
    type: 'football'
  },
  { 
    id: 4, 
    court: 'Cancha Gatorade',
    time: '17:00 - 18:00',
    players: ['Tom Harris', 'Lucy White'],
    type: 'padel'
  },
  { 
    id: 5, 
    court: 'Cancha Powerade',
    time: '18:00 - 19:00',
    players: ['James Brown', 'Emily Taylor'],
    type: 'padel'
  },
];

export default function Dashboard() {
  const { users, isLoading } = useUsers();
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      setFormattedDate(new Date().toLocaleString('es-UY', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'America/Montevideo'
      }));
    };

    updateDateTime();

    const intervalId = setInterval(updateDateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const quickStats = [
    { 
      title: 'Reservas Hoy', 
      value: '12', 
      icon: CalendarIcon,
      color: 'bg-gradient-to-r from-blue-400 to-blue-600',
      hover: 'hover:from-blue-500 hover:to-blue-700',
      iconBg: 'bg-blue-400/30',
      href: '/bookings'
    },
    { 
      title: 'Usuarios Registrados', 
      value: isLoading ? '...' : users.length.toString(), 
      icon: UsersIcon,
      color: 'bg-gradient-to-r from-purple-400 to-purple-600',
      hover: 'hover:from-purple-500 hover:to-purple-700',
      iconBg: 'bg-purple-400/30',
      href: '/users'
    },
    { 
      title: 'Canchas Registradas', 
      value: '8', 
      icon: ScaleIcon,
      color: 'bg-gradient-to-r from-orange-400 to-orange-600',
      hover: 'hover:from-orange-500 hover:to-orange-700',
      iconBg: 'bg-orange-400/30',
      href: '/courts'
    },
    { 
      title: 'Ingresos del Día', 
      value: '$1,250', 
      icon: ChartBarIcon,
      color: 'bg-gradient-to-r from-green-400 to-green-600',
      hover: 'hover:from-green-500 hover:to-green-700',
      iconBg: 'bg-green-400/30',
      href: '/finances'
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6 p-8">
        <div className="text-center mb-6 min-h-[80px]">
          <h2 className="text-2xl font-bold text-gray-800">¡Que tengas un bonito día!</h2>
          <p suppressHydrationWarning className="text-gray-600 text-sm">
            {formattedDate}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {quickStats.map((stat, index) => (
            <Link key={index} href={stat.href}>
              <div className={`${stat.color} ${stat.hover} rounded-xl shadow-lg p-6 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl cursor-pointer`}>
                <div className="flex items-center">
                  <div className={`${stat.iconBg} rounded-lg p-3 mr-4`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm font-medium">{stat.title}</p>
                    <p className="text-white text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Canchas Destacadas</h2>
            <Link href="/courts" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center">
              Ver todas
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {courts.map((court) => (
              <div key={court.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-32">
                  <Image
                    src={court.image}
                    alt={court.name}
                    fill
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
                    court.status === 'Disponible' ? 'bg-green-500 text-white' :
                    court.status === 'Ocupada' ? 'bg-red-500 text-white' :
                    'bg-yellow-500 text-white'
                  }`}>
                    {court.status}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-800">{court.name}</h3>
                  <p className="text-sm text-gray-600">Próximo turno: {court.nextAvailable}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Próximas Reservas</h2>
              <Link href="/bookings" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                Ver todas
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingReservations.map((reservation) => (
                <div key={reservation.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <ClockIcon className="text-blue-600 w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{reservation.court}</p>
                      <p className="text-sm text-gray-600">{reservation.time}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {reservation.players.join(' vs ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ActiveUsers />
        </div>
      </div>
    </div>
  );
}
