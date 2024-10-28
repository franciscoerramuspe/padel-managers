"use client";

import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

// Sample events data
const events = [
  {
    id: 1,
    title: 'Reserva: Cancha 1',
    start: new Date(2023, 5, 1, 10, 0),
    end: new Date(2023, 5, 1, 11, 30),
    resourceId: 1,
  },
  {
    id: 2,
    title: 'Reserva: Cancha 2',
    start: new Date(2023, 5, 2, 14, 0),
    end: new Date(2023, 5, 2, 15, 30),
    resourceId: 2,
  },
];

// Sample resources (courts)
const resources = [
  { id: 1, title: 'Cancha 1' },
  { id: 2, title: 'Cancha 2' },
  { id: 3, title: 'Cancha 3' },
];

export default function BookingCalendarPage() {
  const [view, setView] = useState('month');

  const handleViewChange = (newView: string) => {
    setView(newView);
  };

  return (
    <div className="flex-1 p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Calendario de Reservas</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <button
              className={`mr-2 px-4 py-2 rounded-lg ${view === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => handleViewChange('month')}
            >
              Mes
            </button>
            <button
              className={`mr-2 px-4 py-2 rounded-lg ${view === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => handleViewChange('week')}
            >
              Semana
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${view === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => handleViewChange('day')}
            >
              Día
            </button>
          </div>
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
            Nueva Reserva
          </button>
        </div>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          resources={resources}
          resourceIdAccessor="id"
          resourceTitleAccessor="title"
          views={['month', 'week', 'day']}
          view={view as any}
          onView={handleViewChange as any}
          style={{ height: 'calc(100vh - 200px)' }}
          className="rounded-lg overflow-hidden"
        />
      </div>
    </div>
  );
}
