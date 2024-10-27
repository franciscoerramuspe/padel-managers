'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import BookingsTable from '@/components/BookingsTable';
import { FaCalendarAlt, FaFilter } from 'react-icons/fa';
import SidebarFilter from '@/components/SidebarFilter';
import ScheduleFilter from '@/components/ScheduleFilter';

const bookingsData = [
  { 
    courtName: 'Padel Court 1', 
    type: 'padel', 
    date: '2024-03-15', 
    time: '09:00 AM - 10:30 AM', 
    players: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Brown'],
    category: '3ra'
  },
  { 
    courtName: 'Padel Court 2', 
    type: 'padel', 
    date: '2024-03-16', 
    time: '02:00 PM - 3:30 PM', 
    players: ['Alex Wilson', 'Emma Davis', 'Chris Lee', 'Olivia Taylor'],
    category: '1ra'
  },
  { 
    courtName: 'Football Field 1', 
    type: 'football', 
    date: '2024-03-15', 
    time: '04:00 PM - 5:30 PM', 
    team: 'Red Dragons'
  },
  { 
    courtName: 'Football Field 2', 
    type: 'football', 
    date: '2024-03-16', 
    time: '07:00 PM - 8:30 PM', 
    team: 'Blue Sharks'
  },
];

export default function BookingsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className={`flex-1 p-8 transition-all duration-300 ${isFilterOpen ? (isFilterCollapsed ? 'mr-16' : 'mr-64') : ''}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Bookings</h1>
            <div className="flex space-x-4">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out flex items-center"
                onClick={() => setIsScheduleOpen(true)}
              >
                <FaCalendarAlt className="mr-2" />
                Calendar
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out flex items-center"
                onClick={() => setIsFilterOpen(true)}
              >
                <FaFilter className="mr-2" />
                Filter
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <BookingsTable bookings={bookingsData} />
          </div>
        </div>
      </div>
      <SidebarFilter 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)}
        onCollapse={(collapsed) => setIsFilterCollapsed(collapsed)}
      />
      <ScheduleFilter isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} />
    </div>
  );
}
