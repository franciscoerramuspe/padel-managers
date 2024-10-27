'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Mock data (replace with actual data fetching in a real application)
const courts = [
  { id: 1, name: 'Court A', status: 'Available' },
  { id: 2, name: 'Court B', status: 'Occupied' },
  { id: 3, name: 'Court C', status: 'Maintenance' },
];

const reservations = [
  { id: 1, court: 'Court A', time: '14:00 - 15:00', players: 'John, Jane' },
  { id: 2, court: 'Court B', time: '15:00 - 16:00', players: 'Mike, Sarah' },
];

const playerStats = [
  { id: 1, name: 'John Doe', gamesPlayed: 20, winRate: '65%' },
  { id: 2, name: 'Jane Smith', gamesPlayed: 15, winRate: '73%' },
];

export default function Dashboard() {
  const [isSidebarCollapsed,] = useState(false);

  return (
    <div className="flex bg-white">
      <div
        className={`flex-1 min-h-screen p-8 transition-all duration-300 ${
          isSidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-800">Padel Management Dashboard</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <section className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Court Status</h2>
            <ul>
              {courts.map((court) => (
                <li key={court.id} className="mb-2 flex justify-between items-center">
                  <span className="text-gray-700">{court.name}</span>
                  <span className={`px-2 py-1 rounded text-white ${
                    court.status === 'Available' ? 'bg-green-500' :
                    court.status === 'Occupied' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}>
                    {court.status}
                  </span>
                </li>
              ))}
            </ul>
            <Link href="/courts" passHref>
              <button className="mt-4 bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
                Manage Courts
              </button>
            </Link>
          </section>

          <section className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Upcoming Reservations</h2>
            <ul>
              {reservations.map((reservation) => (
                <li key={reservation.id} className="mb-2">
                  <p className="text-gray-700"><strong>{reservation.court}</strong> - {reservation.time}</p>
                  <p className="text-sm text-gray-600">Players: {reservation.players}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Top Players</h2>
            <ul>
              {playerStats.map((player) => (
                <li key={player.id} className="mb-2">
                  <p className="text-gray-700"><strong>{player.name}</strong></p>
                  <p className="text-sm text-gray-600">Games: {player.gamesPlayed} | Win Rate: {player.winRate}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
