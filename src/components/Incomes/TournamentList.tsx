import React from 'react';

interface Tournament {
  id: string;
  name: string;
  tournament_info: { inscription_cost: number }[];
  start_date: string;
  end_date: string;
}

interface TournamentListProps {
  tournaments: Tournament[];
}

const TournamentList: React.FC<TournamentListProps> = ({ tournaments }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-black mb-4">Torneos</h2>
      <p className="text-gray-600 mb-4">Total de torneos: {tournaments.length}</p>
      <ul className="divide-y divide-gray-200">
        {tournaments.map((tournament) => (
          <li key={tournament.id} className="py-4 flex justify-between items-center">
            <div>
              <span className="text-lg font-medium text-gray-800">{tournament.name}</span>
              <div className="text-sm text-gray-600">
                {`Inicio: ${new Date(tournament.start_date).toLocaleDateString()} - Fin: ${new Date(tournament.end_date).toLocaleDateString()}`}
              </div>
            </div>
            <span className="font-semibold text-green-600">
              ${tournament.tournament_info[0]?.inscription_cost}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TournamentList;