'use client';

import React, { useState } from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';

interface IncomeFiltersProps {
  onFilterChange: (filters: IncomeFilters) => void;
  filterType: 'monthly' | 'court';
}

interface IncomeFilters {
  year?: string;
  sortBy?: string;
  courtType?: string;
  period?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export default function IncomeFilters({ onFilterChange, filterType }: IncomeFiltersProps) {
  const [filters, setFilters] = useState<IncomeFilters>({
    year: new Date().getFullYear().toString(),
    sortBy: 'chronological',
    courtType: 'all',
    period: 'month',
    dateRange: {
      start: '',
      end: ''
    }
  });

  const [appliedFilters, setAppliedFilters] = useState<IncomeFilters | null>(null);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    onFilterChange(filters);
    setIsFilterMenuOpen(false);
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      year: new Date().getFullYear().toString(),
      sortBy: 'chronological',
      courtType: 'all',
      period: 'month',
      dateRange: { start: '', end: '' }
    };
    setFilters(defaultFilters);
    setAppliedFilters(null);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <FaFilter className="w-4 h-4" />
            Filtros
          </button>
          {appliedFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100"
            >
              <FaTimes className="w-4 h-4" />
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {appliedFilters && (
        <div className="flex flex-wrap gap-2 p-4 bg-blue-50 border text-black border-blue-100 rounded-lg">
          {Object.entries(appliedFilters).map(([key, value]) => {
            if (!value || (typeof value === 'object' && !value.start && !value.end)) return null;
            return (
              <div
                key={key}
                className="flex items-center gap-2 px-3 py-1 text-sm text-black bg-white border border-blue-200 rounded-full"
              >
                <span className="font-medium text-blue-700">
                  {key === 'year' && `Año: ${value}`}
                  {key === 'sortBy' && `Ordenar por: ${value}`}
                  {key === 'courtType' && `Tipo de cancha: ${value}`}
                  {key === 'period' && `Período: ${value}`}
                  {key === 'dateRange' && value.start && value.end && 
                    `Fechas: ${value.start} - ${value.end}`}
                </span>
                <button
                  onClick={() => {
                    const newFilters = { ...filters };
                    delete newFilters[key as keyof IncomeFilters];
                    setFilters(newFilters);
                    setAppliedFilters(newFilters);
                    onFilterChange(newFilters);
                  }}
                  className="text-blue-400 hover:text-blue-600"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {isFilterMenuOpen && (
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Aquí van los filtros específicos según filterType */}
            {filterType === 'monthly' && (
              <>
                {/* Filtros mensuales existentes */}
              </>
            )}
            
            {filterType === 'court' && (
              <>
                {/* Filtros de cancha existentes */}
              </>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
            <button
              onClick={() => setIsFilterMenuOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
