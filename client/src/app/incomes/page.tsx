'use client';

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '@/styles/income-calendar.css';
import { FaChartBar } from 'react-icons/fa';
import { useTournaments } from '@/hooks/useTournaments';
import TournamentList from '@/components/Incomes/TournamentList';
import { ResponsiveBar } from '@nivo/bar';
import Header from '@/components/Header';
import { ChartBarIcon } from '@heroicons/react/24/outline';

export default function IncomesPage() {
  const { tournaments, loading, error } = useTournaments();
  const [date, setDate] = useState(new Date());

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar los torneos</div>;

  const estimatedIncomeData = tournaments.map(tournament => {
    const startDate = new Date(tournament.start_date);
    const endDate = new Date(tournament.end_date);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;
    const income = tournament.tournament_info[0]?.inscription_cost * days;

    return {
      tournamentName: tournament.name,
      estimatedIncome: income,
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Header 
          title="Estadísticas"
          description="Visualiza los ingresos estimados y la lista de torneos."
          icon={<ChartBarIcon className="w-6 h-6" />}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl text-black font-semibold mb-4">Lista de Torneos</h2>
            <TournamentList tournaments={tournaments} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl text-black font-semibold mb-4">Ingresos Estimados</h2>
            <div style={{ height: '400px' }}>
              <ResponsiveBar
                data={estimatedIncomeData}
                keys={['estimatedIncome']}
                indexBy="tournamentName"
                margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
                padding={0.3}
                colors={{ scheme: 'nivo' }}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Torneos',
                  legendPosition: 'middle',
                  legendOffset: 32,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Ingresos Estimados',
                  legendPosition: 'middle',
                  legendOffset: -40,
                }}
                labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                role="application"
                ariaLabel="Estimación de ingresos por torneo"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-black mb-4">Calendario de Ingresos</h2>
            <div className="income-calendar" style={{ maxWidth: '400px', margin: '0 auto' }}>
              <Calendar
                onChange={(value) => setDate(value as Date)}
                value={date}
                tileClassName={({ date: tileDate, view }) => {
                  if (view === 'month') {
                    const day = tileDate.getDate();
                    if (day % 3 === 0) return 'high-income-day';
                    if (day % 3 === 1) return 'medium-income-day';
                    if (day % 3 === 2) return 'low-income-day';
                  }
                  return null;
                }}
              />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-black mb-4">Detalles del día seleccionado</h2>
            <div className="space-y-4">
              <p className="text-gray-600 flex items-center">
                <FaChartBar className="inline mr-2" />   
                {date.toLocaleDateString()}
              </p>
              <div className="border-t pt-4">
                <p className="font-semibold text-gray-600">Ingresos totales del día: $890</p>
                <ul className="mt-2 space-y-2">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Cancha Gatorade</span>
                    <span className="font-semibold text-green-600">$350</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Cancha Powerade</span>
                    <span className="font-semibold text-green-600">$290</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Cancha Red Bull</span>
                    <span className="font-semibold text-green-600">$250</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
