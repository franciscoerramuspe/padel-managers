'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CalendarIcon, UsersIcon, ChartBarIcon, ScaleIcon, ClockIcon } from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';
import { useUsers } from '@/hooks/useUsers';
import { Calendar, Building2, Users, Trophy } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Lazy load de componentes grandes
const ActiveUsers = dynamic(() => import('../../components/Dashboard/ActiveUsers'), {
  loading: () => <div className="animate-pulse bg-gray-100 h-64 rounded-xl"></div>,
  ssr: false
});

export default function Dashboard() {
  const { users, isLoading } = useUsers();
  const [formattedDate, setFormattedDate] = useState('');
  const [upcomingTournaments, setUpcomingTournaments] = useState<Tournament[]>([]);
  const [loadingTournaments, setLoadingTournaments] = useState(true);

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
      value: users?.length || '0', 
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

  interface Tournament {
    id: string;
    name: string;
    status: string;
    start_date: string;
    end_date: string;
    tournament_teams: any[];
    tournament_info: [{
      tournament_club_name: string;
      tournament_thumbnail?: string;
    }];
  }

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

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tournaments`);
        if (!response.ok) throw new Error('Error al cargar los torneos');
        const data = await response.json();
        const upcoming = data
          .filter((t: Tournament) => t.status === 'upcoming')
          .slice(0, 3);
        setUpcomingTournaments(upcoming);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
      } finally {
        setLoadingTournaments(false);
      }
    };

    fetchTournaments();
  }, []);

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd MMM yyyy', { locale: es });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8 space-y-6">
        <div className="text-center h-[80px] flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800">¡Que tengas un bonito día!</h2>
          <div className="h-[24px]">
            <p suppressHydrationWarning className="text-gray-600 text-sm">
              {formattedDate}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <Link key={index} href={stat.href}>
              <div className={`h-[120px] ${stat.color} ${stat.hover} rounded-xl shadow-lg p-6 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl cursor-pointer`}>
                <div className="flex items-center h-full">
                  <div className={`${stat.iconBg} rounded-lg p-3 mr-4 flex-shrink-0`}>
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

        <div className="bg-white rounded-xl shadow-md p-6 min-h-[400px]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Próximos Torneos</h2>
            <Link href="/tournaments" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center">
              Ver todos
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="min-h-[300px]">
            {loadingTournaments ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
              </div>
            ) : upcomingTournaments.length === 0 ? (
              <div className="flex justify-center items-center h-full text-center text-gray-500">
                No hay torneos próximos
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {upcomingTournaments.map((tournament) => (
                  <Link
                    href={`/tournaments/${tournament.id}`}
                    key={tournament.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200"
                  >
                    <div className="relative h-40">
                      {tournament.tournament_info[0]?.tournament_thumbnail ? (
                        <Image
                          src={tournament.tournament_info[0].tournament_thumbnail}
                          alt={tournament.name}
                          fill
                          priority={true}
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                          quality={75}
                          loading="eager"
                          fetchPriority="high"
                          onLoadingComplete={(img) => {
                            img.classList.remove('opacity-0');
                            img.classList.add('opacity-100');
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <Trophy className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-4 h-[160px]">
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{tournament.name}</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{formatDate(tournament.start_date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{tournament.tournament_info[0]?.tournament_club_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 flex-shrink-0" />
                          <span>{tournament.tournament_teams.length} equipos</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[400px]">
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
