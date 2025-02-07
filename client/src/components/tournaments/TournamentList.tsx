'use client';

import { useState } from 'react';
import { useTournaments } from '@/hooks/useTournaments';
import { useCategories } from '@/hooks/useCategories';
import { TournamentCard } from '@/components/Tournaments/TournamentCard';
import { Search } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { EmptyState } from '@/components/ui/EmptyState';

export default function TournamentList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const { tournaments, loading, error } = useTournaments();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();

  if (loading || categoriesLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (categoriesError) return <ErrorMessage message={categoriesError} />;

  const filteredTournaments = tournaments
    .filter(tournament => 
      tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tournament.tournament_info[0]?.tournament_club_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(tournament => filterStatus === 'all' ? true : tournament.status === filterStatus)
    .filter(tournament => selectedCategory === 'all' ? true : tournament.category_id === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
        <div className="p-4 md:p-6 space-y-4 md:space-y-0 md:flex md:items-center md:gap-6">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar por nombre o club..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="min-w-[200px]">
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="all">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Status Filters */}
          <div className="flex gap-2 bg-gray-50 p-1 rounded-lg">
            <button
              onClick={() => setFilterStatus('all')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                filterStatus === 'all' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterStatus('upcoming')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                filterStatus === 'upcoming' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Próximos
            </button>
            <button
              onClick={() => setFilterStatus('in_progress')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                filterStatus === 'in_progress' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              En Curso
            </button>
          </div>
        </div>
      </div>

      {/* Tournament Cards Grid or Empty State */}
      {filteredTournaments.length === 0 ? (
        <div className="mt-8">
          <EmptyState message="No se encontraron torneos con los filtros seleccionados" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament) => (
            <TournamentCard
              key={tournament.id}
              tournament={tournament}
              categories={categories}
            />
          ))}
        </div>
      )}
    </div>
  );
}

