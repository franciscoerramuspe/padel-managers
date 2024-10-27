'use client';

import React, { useState } from 'react';
import { ResponsivePie } from '@nivo/pie';
import Link from 'next/link';
import IncomeFilters from '@/components/Incomes/IncomeFilters';
import { FaArrowLeft } from 'react-icons/fa';

const courtIncomeData = [
  { id: "Cancha Gatorade", value: 4000, color: "hsl(207, 70%, 50%)" },
  { id: "Cancha Powerade", value: 3000, color: "hsl(91, 70%, 50%)" },
  { id: "Cancha Red Bull", value: 2500, color: "hsl(43, 70%, 50%)" },
  { id: "Cancha Coca Cola", value: 2500, color: "hsl(43, 70%, 50%)" },
  { id: "Cancha Pepsi", value: 2500, color: "hsl(43, 70%, 50%)" },
];

export default function CourtIncomePage() {
  const [filters, setFilters] = useState({
    courtType: 'all',
    period: 'month'
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
          <h1 className="text-3xl font-bold text-gray-900">Ingresos por Cancha</h1>
        </div>

        <IncomeFilters 
          filterType="court"
          onFilterChange={(newFilters) => setFilters({ ...filters, ...newFilters })}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Distribución de Ingresos</h2>
            <div className="h-[400px]">
              <ResponsivePie
                data={courtIncomeData}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                enableArcLinkLabels={true}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
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
                    itemTextColor: '#999',
                    itemDirection: 'left-to-right',
                    itemOpacity: 1,
                    symbolSize: 18,
                    symbolShape: 'circle',
                  }
                ]}
              />
            </div>
          </div>

          <div className="bg-blue-100 rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Detalles por Cancha</h2>
            <div className="space-y-4">
              {courtIncomeData.map((court) => (
                <div key={court.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-700">{court.id}</h3>
                    <p className="text-sm font-medium text-orange-600">Ocupación: 85%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">${court.value}</p>
                    <p className="text-sm text-gray-600">+12% vs mes anterior</p>
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
