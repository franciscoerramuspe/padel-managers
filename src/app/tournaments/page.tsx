import TournamentList from './TournamentList';
import TournamentFilters from './TournamentFilters';

export default async function TournamentsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Torneos</h1>
        <a 
          href="/tournaments/create" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Crear Torneo
        </a>
      </div>
      
      <div className="space-y-6">
        <TournamentFilters />
        <TournamentList />
      </div>
    </div>
  );
}