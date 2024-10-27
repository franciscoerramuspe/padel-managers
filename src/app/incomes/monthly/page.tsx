'use client';

import React, { useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import Link from 'next/link';
import IncomeFilters from '@/components/Incomes/IncomeFilters';
import { FaArrowLeft } from 'react-icons/fa';

// Example data - replace with your actual data
const monthlyData = [
  { month: 'Ene', income: 4500, previousYear: 4000 },
  { month: 'Feb', income: 3800, previousYear: 3500 },
  { month: 'Mar', income: 5200, previousYear: 4800 },
  // Add more months...
];

export default function MonthlyIncomePage() {
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    sortBy: 'chronological'
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/incomes" 
            className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4"
          >
            <FaArrowLeft /> Volver a ingresos
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Ingresos Mensuales</h1>
        </div>

        <IncomeFilters 
          filterType="monthly"
          onFilterChange={(newFilters) => setFilters({ ...filters, ...newFilters })}
        />

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="h-[600px]">
            <ResponsiveBar
              data={monthlyData}
              keys={['income', 'previousYear']}
              indexBy="month"
              margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
              padding={0.3}
              valueScale={{ type: 'linear' }}
              colors={{ scheme: 'nivo' }}
              borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Mes',
                legendPosition: 'middle',
                legendOffset: 32
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Ingresos ($)',
                legendPosition: 'middle',
                legendOffset: -40
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              legends={[
                {
                  dataFrom: 'keys',
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 120,
                  translateY: 0,
                  itemsSpacing: 2,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemDirection: 'left-to-right',
                  itemOpacity: 0.85,
                  symbolSize: 20
                }
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
