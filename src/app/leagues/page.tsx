'use client';

import { useEffect, useState } from 'react';
import { TableIcon, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import { LeagueList } from '@/components/Leagues/LeagueList';
import { LeagueFilters } from '@/components/Leagues/LeagueFilters';
import { League } from '@/types/league';
import { useCategories, Category } from '@/hooks/useCategories';

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
        console.log(data);
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

  const renderContent = () => {
    if (isLoadingLeagues || isLoadingCategories) {
      return <p className="text-gray-900 dark:text-gray-100">Cargando datos...</p>;
    }
    if (leagues.length === 0) {
      return <p className="text-gray-600 dark:text-gray-400">No hay ligas para mostrar. Verifique que la API esté devolviendo ligas o ajuste el parseo de datos en LeaguesPage.tsx si la estructura es anidada.</p>;
    }
    return <LeagueList leagues={leagues} categories={categories} />;
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