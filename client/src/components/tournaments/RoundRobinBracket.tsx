interface Match {
    id: string;
    round: number;
    position: number;
    team1?: { id: string; name: string };
    team2?: { id: string; name: string };
    winner_id: string | null;
    status: 'pending' | 'completed';
  }
  
  interface Props {
    matches: Match[];
    teams: Array<{ id: string; name: string }>;
  }
  
  interface MatchCardProps {
    match: {
      id: string;
      team1: string;
      team2: string;
      round: number;
      scheduled_start?: string;
      scheduled_end?: string;
      court_id?: string;
    };
    onSchedule: (matchId: string) => void;
  }
  
  export function MatchCard({ match, onSchedule }: MatchCardProps) {
    return (
      <div className="border rounded-lg p-4 mb-4 bg-white shadow">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold">Round {match.round}</h3>
            <p>{match.team1} vs {match.team2}</p>
            {match.scheduled_start && (
              <p className="text-sm text-gray-600">
                {new Date(match.scheduled_start).toLocaleString()}
              </p>
            )}
          </div>
          {!match.scheduled_start && (
            <button
              onClick={() => onSchedule(match.id)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Schedule Match
            </button>
          )}
        </div>
      </div>
    );
  }
  
  export default function RoundRobinBracket({ matches, teams }: Props) {
    // Group matches by round
    const roundMatches = matches.reduce((acc, match) => {
      if (!acc[match.round]) acc[match.round] = [];
      acc[match.round].push(match);
      return acc;
    }, {} as Record<number, Match[]>);
  
    return (
      <div className="w-full overflow-x-auto">
        <div className="min-w-[768px]">
          {/* Rounds Navigation */}
          <div className="flex gap-2 mb-6">
            {Object.keys(roundMatches).map((round) => (
              <button
                key={round}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 font-medium"
              >
                Fecha {round}
              </button>
            ))}
          </div>
  
          {/* Teams Grid */}
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Equipo
                  </th>
                  {teams.map((team) => (
                    <th key={team.id} scope="col" className="px-6 py-3">
                      {team.name}
                    </th>
                  ))}
                  <th scope="col" className="px-6 py-3">
                    PTS
                  </th>
                </tr>
              </thead>
              <tbody>
                {teams.map((teamRow) => (
                  <tr key={teamRow.id} className="bg-white border-b hover:bg-gray-50">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {teamRow.name}
                    </th>
                    {teams.map((teamCol) => {
                      if (teamRow.id === teamCol.id) {
                        return (
                          <td key={teamCol.id} className="px-6 py-4 bg-gray-100">
                            -
                          </td>
                        );
                      }
  
                      const match = matches.find(
                        m => 
                          (m.team1?.id === teamRow.id && m.team2?.id === teamCol.id) ||
                          (m.team1?.id === teamCol.id && m.team2?.id === teamRow.id)
                      );
  
                      return (
                        <td key={teamCol.id} className="px-6 py-4">
                          {match ? (
                            <div className="flex items-center justify-center">
                              {match.winner_id ? (
                                <span className={`font-medium ${
                                  match.winner_id === teamRow.id ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {match.winner_id === teamRow.id ? 'G' : 'P'}
                                </span>
                              ) : (
                                <span className="text-gray-400">vs</span>
                              )}
                            </div>
                          ) : '-'}
                        </td>
                      );
                    })}
                    <td className="px-6 py-4 font-medium">
                      {matches
                        .filter(m => m.winner_id === teamRow.id)
                        .length * 3}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
  
          {/* Round Details */}
          <div className="mt-8">
            {Object.entries(roundMatches).map(([round, matches]) => (
              <div key={round} className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Fecha {round}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {matches.map((match) => (
                    <div key={match.id} className="border rounded-lg p-4 bg-white">
                      <div className="flex justify-between items-center gap-4">
                        <div className={`flex-1 p-2 text-center rounded ${
                          match.winner_id === match.team1?.id ? 'bg-green-100' : ''
                        }`}>
                          {match.team1?.name}
                        </div>
                        <div className="text-sm text-gray-500">vs</div>
                        <div className={`flex-1 p-2 text-center rounded ${
                          match.winner_id === match.team2?.id ? 'bg-green-100' : ''
                        }`}>
                          {match.team2?.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

interface ScheduleMatchModalProps {
  isOpen: boolean;
  matchId: string | null;
  onClose: () => void;
  onSchedule: (matchId: string, scheduleData: ScheduleData) => Promise<void>;
}

interface ScheduleData {
  court_id: string;
  start_time: string;
  end_time: string;
}

export function ScheduleMatchModal({ isOpen, matchId, onClose, onSchedule }: ScheduleMatchModalProps) {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [courtId, setCourtId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchId) return;

    await onSchedule(matchId, {
      court_id: courtId,
      start_time: startTime,
      end_time: endTime
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Schedule Match</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Court</label>
            <select 
              value={courtId}
              onChange={(e) => setCourtId(e.target.value)}
              className="w-full border rounded p-2"
              required
            >
              <option value="">Select a court</option>
              <option value="court-1">Court 1</option>
              <option value="court-2">Court 2</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Start Time</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">End Time</label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}