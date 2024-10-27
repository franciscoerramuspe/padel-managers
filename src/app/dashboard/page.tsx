'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaCalendarAlt, FaClock, FaUsers, FaChartBar } from 'react-icons/fa';
import { GiTennisCourt } from 'react-icons/gi';

const quickStats = [
  { 
    title: 'Reservas Hoy', 
    value: '12', 
    icon: FaCalendarAlt, 
    color: 'bg-blue-500',
    href: '/bookings'
  },
  { 
    title: 'Usuarios Registrados', 
    value: '45', 
    icon: FaUsers, 
    color: 'bg-orange-500',
    href: '/users'
  },
  { 
    title: 'Canchas Registradas', 
    value: '8', 
    icon: GiTennisCourt, 
    color: 'bg-purple-500',
    href: '/courts'
  },
  { 
    title: 'Ingresos del Día', 
    value: '$1,250', 
    icon: FaChartBar, 
    color: 'bg-green-500',
    href: '/finances' // Asumiendo que existe o se creará esta ruta
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

const activeUsers = [
  { id: 1, name: 'John Doe', role: 'Admin', lastActive: '5 min ago', avatar: '/assets/user.png' },
  { id: 2, name: 'Jane Smith', role: 'User', lastActive: '10 min ago', avatar: '/assets/user.png' },
  { id: 3, name: 'Mike Johnson', role: 'User', lastActive: '15 min ago', avatar: '/assets/user.png' },
  { id: 4, name: 'Sarah Brown', role: 'Manager', lastActive: '20 min ago', avatar: '/assets/user.png' },
  { id: 5, name: 'Alex Wilson', role: 'User', lastActive: '25 min ago', avatar: '/assets/user.png' },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {quickStats.map((stat, index) => (
            <Link key={index} href={stat.href}>
              <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer transform hover:-translate-y-1 transition-transform duration-200">
                <div className="flex items-center">
                  <div className={`${stat.color} rounded-full p-3 text-white mr-4`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Featured Courts Section - More Compact */}
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
                    layout="fill"
                    objectFit="cover"
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

        {/* 50/50 Split Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upcoming Reservations */}
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
                      <FaClock className="text-blue-600 w-4 h-4" />
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

          {/* Active Users */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Usuarios Activos</h2>
              <Link href="/users" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                Ver todos
              </Link>
            </div>
            <div className="space-y-3">
              {activeUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="relative w-10 h-10 mr-3">
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        layout="fill"
                        className="rounded-full"
                      />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.role}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {user.lastActive}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
