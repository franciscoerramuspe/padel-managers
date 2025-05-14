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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leagues`);
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

  const renderContent = () => {
    if (isLoadingLeagues || isLoadingCategories) {
      return <p>Cargando datos...</p>;
    }
    if (leagues.length === 0) {
      return <p>No hay ligas para mostrar. Verifique que la API esté devolviendo ligas o ajuste el parseo de datos en LeaguesPage.tsx si la estructura es anidada.</p>;
    }
    return <LeagueList leagues={leagues} categories={categories} />;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <Header 
          title="Ligas"
          icon={<TableIcon className="w-6 h-6" />}
          description="Administra y visualiza todas las ligas."
          button={
            <Link 
              href="/leagues/create" 
              className="bg-[#6B8AFF] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#5A75E6] transition-colors duration-300 flex items-center"
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