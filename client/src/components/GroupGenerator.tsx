import React, { useState, useEffect } from 'react';

interface GroupGeneratorProps {
  tournamentId: string;
  totalTeams: number;
}

interface Group {
  name: string;
  teams: Array<{
    id: string;
    name: string;
    seed: number;
  }>;
}

export function GroupGenerator({ tournamentId, totalTeams }: GroupGeneratorProps) {
  const [numberOfGroups, setNumberGroups] = useState(2);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<Record<string, Group>>({});

  useEffect(() => {
    fetchExistingGroups();
  }, [tournamentId]);

  const fetchExistingGroups = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tournaments/${tournamentId}/groups`);
      if (!response.ok) throw new Error('Failed to fetch groups');
      
      const data = await response.json();
      if (data.groups) {
        setGroups(data.groups);
      }
    } catch (err) {
      setError('No se han generado grupos');
    } finally {
      setIsLoading(false);
    }
  };

  const generateGroups = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tournaments/${tournamentId}/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numberOfGroups })
      });

      if (!response.ok) throw new Error('Failed to generate groups');
      
      const data = await response.json();
      setGroups(data.groups);
      
    } catch (err) {
      setError('Could not generate groups');
    } finally {
      setIsLoading(false);
    }
  };

  const maxGroups = Math.floor(totalTeams / 2);

  if (isLoading) {
    return <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500" />;
  }

  return (
    <div className="space-y-4">
      {Object.keys(groups).length === 0 ? (
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">
            Número de Grupos:
            <select 
              value={numberOfGroups}
              onChange={(e) => setNumberGroups(Number(e.target.value))}
              className="ml-2 p-2 border rounded"
            >
              {Array.from({length: maxGroups - 1}, (_, i) => i + 2).map(num => (
                <option key={num} value={num}>
                  {num} grupos ({Math.ceil(totalTeams / num)} equipos por grupo)
                </option>
              ))}
            </select>
          </label>
          
          <button
            onClick={generateGroups}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Generando...' : 'Generar Grupos'}
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(groups).map(([groupKey, group]) => (
            <div key={groupKey} className="bg-gray-50 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">{group.name}</h3>
              <ul className="space-y-3">
                {group.teams.map((team) => (
                  <li 
                    key={team.id} 
                    className="flex justify-between items-center p-2 bg-white rounded shadow-sm"
                  >
                    <span>{team.name}</span>
                    <span className="text-sm text-gray-500">Seed: {team.seed}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
} 