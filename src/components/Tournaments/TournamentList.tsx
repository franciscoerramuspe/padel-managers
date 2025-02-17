'use client';

import { useState } from 'react';
import { useTournaments } from '@/hooks/useTournaments';
import { useCategories } from '@/hooks/useCategories';
import { TournamentCard } from '@/components/Tournaments/TournamentCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { EmptyState } from '@/components/ui/EmptyState';
import { FilterSection } from '@/components/ui/FilterSection';

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
      tournament.tournament_info[0]?.tournament_club_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(tournament => filterStatus === 'all' ? true : tournament.status === filterStatus)
    .filter(tournament => selectedCategory === 'all' ? true : tournament.category_id === selectedCategory);

  return (
    <div className="space-y-6">
      <FilterSection
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        filterStatus={filterStatus}
        onStatusChange={setFilterStatus}
        categories={categories}
      />

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

