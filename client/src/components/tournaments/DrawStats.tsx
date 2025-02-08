interface DrawStatsProps {  
  teamsCount: number;
  matchesCount: number;
  status: string;
}

export function DrawStats({ teamsCount, matchesCount, status }: DrawStatsProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-6">Estado del Torneo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Equipos Inscritos</h3>
            <p className="text-2xl font-bold text-blue-600">{teamsCount}/8</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-2">Partidos Programados</h3>
            <p className="text-2xl font-bold text-green-600">{matchesCount}</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="font-medium text-purple-900 mb-2">Estado</h3>
            <p className="text-2xl font-bold text-purple-600">{status}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 