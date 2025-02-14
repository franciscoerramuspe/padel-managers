'use client';

import { useState } from 'react';
import { BanknotesIcon } from '@heroicons/react/24/outline';
import { useTournaments } from '@/hooks/useTournaments';
import { useCategories } from '@/hooks/useCategories';
import { FilterSection } from '@/components/ui/FilterSection';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { EmptyState } from '@/components/ui/EmptyState';
import { PaymentsTable } from '@/components/Payments/PaymentsTable';
import Header from '@/components/Header';

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const { tournaments, loading: tournamentsLoading, error: tournamentsError } = useTournaments();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();

  if (tournamentsLoading || categoriesLoading) return <LoadingSpinner />;
  if (tournamentsError) return <ErrorMessage message={tournamentsError} />;
  if (categoriesError) return <ErrorMessage message={categoriesError} />;

  const filteredTournaments = tournaments
    .filter(tournament => 
      tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tournament.tournament_info[0]?.tournament_club_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(tournament => filterStatus === 'all' ? true : tournament.status === filterStatus)
    .filter(tournament => selectedCategory === 'all' ? true : tournament.category_id === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <Header 
          title="Pagos de Inscripciones"
          icon={<BanknotesIcon className="w-6 h-6" />}
          description="Gestiona los pagos de inscripción de todos los torneos."
        />
        
        <div className="space-y-8">
          <FilterSection 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            filterStatus={filterStatus}
            onStatusChange={setFilterStatus}
            categories={categories}
            searchPlaceholder="Buscar"
          />

          {filteredTournaments.length === 0 ? (
            <EmptyState message="No se encontraron torneos con los filtros seleccionados" />
          ) : (
            <PaymentsTable 
              tournaments={filteredTournaments}
              categories={categories}
            />
          )}
        </div>
      </div>
    </div>
  );
}

