'use client';

import { useEffect, useState } from 'react';
import { TableIcon, PlusCircle, SearchX, FilterX } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import { LeagueList } from '@/components/Leagues/LeagueList';
import { LeagueFilters } from '@/components/Leagues/LeagueFilters';
import { League } from '@/types/league';
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';

export default function LeaguesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('Todos');
  const [leagues, setLeagues] = useState<League[]>([]);
  const [isLoadingLeagues, setIsLoadingLeagues] = useState(true);
  const { categories, isLoading: isLoadingCategories, fetchCategories } = useCategories();
  
  useEffect(() => {
    const loadLeagues = async () => {
      setIsLoadingLeagues(true);
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          console.error('No authentication token found');
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leagues/all?page=1&pageSize=10`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          console.error('Failed to fetch leagues. Status:', response.status);
          throw new Error(`Failed to fetch leagues. Status: ${response.status}`);
        }
        const data = await response.json();
        setLeagues(Array.isArray(data) ? data : data.leagues || data.data || []);
      } catch (error) {
        console.error("Error fetching leagues:", error);
        setLeagues([]);
      } finally {
        setIsLoadingLeagues(false);
      }
    };

    loadLeagues();
    if (fetchCategories) {
      fetchCategories(); 
    }
  }, [fetchCategories]);

  const getStatusDisplayName = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'upcoming': 'Próximas',
      'in_progress': 'En Curso',
      'finished': 'Finalizadas'
    };
    return statusMap[status] || status;
  };

  const filteredLeagues = leagues
    .filter(league => {
      // Filter by search query
      if (searchQuery.trim()) {
        return league.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
      }
      return true;
    })
    .filter(league => {
      // Filter by category
      if (selectedCategory && selectedCategory !== 'all') {
        return league.category_id === selectedCategory;
      }
      return true;
    })
    .filter(league => {
      // Filter by status
      if (selectedStatus !== 'Todos') {
        const statusMap: { [key: string]: string } = {
          'Próximas': 'upcoming',
          'En Curso': 'in_progress',
          'Finalizadas': 'finished'
        };
        return league.status === statusMap[selectedStatus];
      }
      return true;
    });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedStatus('Todos');
  };

  const renderEmptyState = () => {
    const hasFilters = searchQuery.trim() || selectedCategory !== 'all' || selectedStatus !== 'Todos';
    const selectedCategoryName = categories?.find(cat => cat.id === selectedCategory)?.name;

    const getStatusMessage = (status: string) => {
      switch (status) {
        case 'upcoming':
          return 'próximas';
        case 'in_progress':
          return 'en curso';
        case 'finished':
          return 'finalizadas';
        default:
          return status.toLowerCase();
      }
    };

    if (hasFilters) {
      return (
        <div className="text-center py-12">
          <SearchX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No se encontraron ligas
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {searchQuery.trim() && (
              <span>No hay ligas que coincidan con "{searchQuery}"{selectedCategoryName ? ' en la categoría ' + selectedCategoryName : ''}{selectedStatus !== 'Todos' ? ' que estén ' + getStatusMessage(selectedStatus.toLowerCase()) : ''}</span>
            )}
            {!searchQuery.trim() && (
              <span>
                No hay ligas {selectedCategoryName ? 'en la categoría ' + selectedCategoryName : ''}{selectedStatus !== 'Todos' ? ' que estén ' + getStatusMessage(selectedStatus.toLowerCase()) : ''}
              </span>
            )}
          </p>
          <Button
            onClick={resetFilters}
            variant="outline"
            className="inline-flex items-center"
          >
            <FilterX className="w-4 h-4 mr-2" />
            Limpiar filtros
          </Button>
        </div>
      );
    }

    return (
      <div className="text-center py-12">
        <TableIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          No hay ligas creadas
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Comienza creando tu primera liga
        </p>
        <Link 
          href="/leagues/create" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Crear Liga
        </Link>
      </div>
    );
  };

  const renderContent = () => {
    if (isLoadingLeagues || isLoadingCategories) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
          <p className="text-gray-900 dark:text-gray-100">Cargando datos...</p>
        </div>
      );
    }

    if (leagues.length === 0 || filteredLeagues.length === 0) {
      return renderEmptyState();
    }

    return <LeagueList leagues={filteredLeagues} categories={categories} />;
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-8">
        <Header 
          title="Ligas"
          icon={<TableIcon className="w-6 h-6 text-gray-900 dark:text-gray-100" />}
          description="Administra y visualiza todas las ligas."
          button={
            <Link 
              href="/leagues/create" 
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-300 flex items-center"
            >
              <PlusCircle className="mr-2" size={20} />
              Crear Liga
            </Link>
          }
        />
        
        <div className="space-y-8 mt-8">
          <LeagueFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            categories={categories}
          />
          {renderContent()}
        </div>
      </div>
    </div>
  );
} 