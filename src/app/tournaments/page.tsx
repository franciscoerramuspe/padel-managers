import TournamentList from './TournamentList';
import TournamentFilters from './TournamentFilters';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link'; // Import the correct Link component

export default async function TournamentsPage() {
  return (
    <div className="container mx-auto py-8 px-4 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Torneos</h1>
        <Link 
          href="/tournaments/create" 
          className="bg-[#6B8AFF] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5A75E6] transition-colors duration-300 flex items-center"
        >
          <PlusCircle className="mr-2" size={20} />
          <span className="text-white">Crear Torneo</span>
        </Link>
      </div>
      
      <div className="space-y-8">
        <TournamentFilters />
        <TournamentList />
      </div>
    </div>
  );
}

