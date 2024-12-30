'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, Filter } from 'lucide-react';

export default function TournamentFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');

  const handleFilter = () => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    router.push(`/tournaments?${params.toString()}`);
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm space-y-6">
      <h2 className="font-bold text-xl text-gray-900 flex items-center">
        <Filter className="mr-2" size={24} />
        Filtros
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Calendar className="mr-2" size={18} />
            Fecha inicio
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Calendar className="mr-2" size={18} />
            Fecha fin
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
          />
        </div>
      </div>
      <button
        onClick={handleFilter}
        className="w-full md:w-auto px-6 py-3 bg-[#6B8AFF] text-white rounded-lg hover:bg-[#5A75E6] transition-colors duration-300 font-semibold"
      >
        Aplicar Filtros
      </button>
    </div>
  );
}

