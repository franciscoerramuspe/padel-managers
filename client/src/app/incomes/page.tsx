'use client';

import React, { useState } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '@/styles/income-calendar.css';
import { FaMoneyBillWave, FaChartBar, FaCalendarAlt, FaArrowUp, FaArrowDown, FaFilter, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import IncomeFilterSidebar from '../../components/Incomes/IncomeFilterSidebar';

// Datos de ejemplo
const monthlyData = [
  {
    id: "ingresos",
    data: [
      { x: "Ene", y: 4000 },
      { x: "Feb", y: 3000 },
      { x: "Mar", y: 2000 },
      { x: "Abr", y: 2780 },
      { x: "May", y: 1890 },
      { x: "Jun", y: 2390 },
    ]
  }
];

const courtIncomeData = [
  { id: "Cancha Gatorade", value: 4000, color: "hsl(207, 70%, 50%)" },
  { id: "Cancha Powerade", value: 3000, color: "hsl(91, 70%, 50%)" },
  { id: "Cancha Red Bull", value: 2000, color: "hsl(176, 70%, 50%)" },
];

export default function IncomesPage() {
  const [date, setDate] = useState(new Date());
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<IncomeFilters | null>(null);

  const quickStats = [
    {
      title: 'Ingresos Totales',
      value: '$15,890',
      change: '+12.5%',
      isPositive: true,
      icon: FaMoneyBillWave,
      color: 'bg-green-500'
    },
    {
      title: 'Ingresos Padel',
      value: '$8,450',
      change: '+8.2%',
      isPositive: true,
      icon: FaChartBar,
      color: 'bg-blue-500'
    },
    {
      title: 'Ingresos Fútbol',
      value: '$7,440',
      change: '-3.1%',
      isPositive: false,
      icon: FaChartBar,
      color: 'bg-purple-500'
    },
  ];

  const handleApplyFilters = (filters: IncomeFilters) => {
    setAppliedFilters(filters);
    // Aquí implementarías la lógica para filtrar los datos
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Ingresos</h1>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaFilter />
            Filtros
          </button>
        </div>

        {appliedFilters && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-blue-800">Filtros aplicados:</h3>
              <button
                onClick={() => setAppliedFilters(null)}
                className="text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <FaTimes /> Limpiar filtros
              </button>
            </div>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {appliedFilters.dateRange.start && (
                <div>
                  <span className="font-medium">Fecha inicio:</span> {appliedFilters.dateRange.start}
                </div>
              )}
              {appliedFilters.dateRange.end && (
                <div>
                  <span className="font-medium">Fecha fin:</span> {appliedFilters.dateRange.end}
                </div>
              )}
              {appliedFilters.courtType !== 'all' && (
                <div>
                  <span className="font-medium">Tipo de cancha:</span> {appliedFilters.courtType}
                </div>
              )}
              {/* Añade más filtros aplicados según necesites */}
            </div>
          </div>
        )}

        <IncomeFilterSidebar
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApplyFilters={handleApplyFilters}
        />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                  <div className={`flex items-center mt-2 ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.isPositive ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                    <span className="text-sm">{stat.change} vs mes anterior</span>
                  </div>
                </div>
                <div className={`${stat.color} p-4 rounded-full text-white`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-black font-semibold">Ingresos Mensuales</h2>
              <Link 
                href="/incomes/monthly" 
                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center"
              >
                Ver todos
                <svg 
                  className="w-4 h-4 ml-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </Link>
            </div>
            <div className="h-80">
              <ResponsiveLine
                data={monthlyData}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                xScale={{ type: 'point' }}
                yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                axisTop={null}
                axisRight={null}
                pointSize={10}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                enableGridX={false}
                colors={{ scheme: 'set2' }}
                enableArea={true}
                areaOpacity={0.15}
                useMesh={true}
                legends={[
                  {
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 80,
                    itemHeight: 20,
                    symbolSize: 12,
                    symbolShape: 'circle',
                  }
                ]}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-black font-semibold">Ingresos por Cancha</h2>
              <Link 
                href="/incomes/courts" 
                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center"
              >
                Ver todos
                <svg 
                  className="w-4 h-4 ml-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </Link>
            </div>
            <div className="h-80">
              <ResponsivePie
                data={courtIncomeData}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
                enableArcLinkLabels={true}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#1a1a1a"
                arcLabelsSkipAngle={10}
                legends={[
                  {
                    anchor: 'bottom',
                    direction: 'row',
                    justify: false,
                    translateX: 0,
                    translateY: 56,
                    itemsSpacing: 0,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: '#000',
                    itemDirection: 'left-to-right',
                    itemOpacity: 1,
                    symbolSize: 18,
                    symbolShape: 'circle',
                  }
                ]}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-black mb-4">Calendario de Ingresos</h2>
            <div className="income-calendar" style={{ maxWidth: '400px', margin: '0 auto' }}>
              <Calendar
                onChange={setDate}
                value={date}
                tileClassName={({ date: tileDate, view }) => {
                  if (view === 'month') {
                    // Example logic for different income levels
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
                <FaCalendarAlt className="inline mr-2" />
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
