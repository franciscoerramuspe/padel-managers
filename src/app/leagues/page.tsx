'use client';

import { useState } from 'react';
import { TableIcon, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import { LeagueList } from '@/components/Leagues/LeagueList';
import { LeagueFilters } from '@/components/Leagues/LeagueFilters';
import { League } from '@/types/league';
import { mockLeagues } from '@/mocks/leagueData';

export default function LeaguesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('Todos');

  const filteredLeagues = mockLeagues.filter((league) => {
    const matchesSearch = league.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' ? true : league.category === selectedCategory;
    const matchesStatus = selectedStatus === 'Todos' ? true :
      selectedStatus === 'Próximos' ? league.status === 'upcoming' :
      selectedStatus === 'En Curso' ? league.status === 'in_progress' : true;

    return matchesSearch && matchesCategory && matchesStatus;
  });

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
        
        <div className="space-y-8">
          <LeagueFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />
          <LeagueList leagues={filteredLeagues} />
        </div>
      </div>
    </div>
  );
} 