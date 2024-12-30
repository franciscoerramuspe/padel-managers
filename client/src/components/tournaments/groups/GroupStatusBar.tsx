interface GroupStatusBarProps {
  total: number;
  completed: number;
}

export function GroupStatusBar({ total, completed }: GroupStatusBarProps) {
  if (total === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Estado de los Grupos</h3>
        <p className="text-sm text-gray-600">No hay partidos de grupo configurados</p>
      </div>
    );
  }

  const percentage = (completed / total) * 100;
  const remainingMatches = total - completed;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Estado de los Grupos</h3>
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        <span className="text-sm text-gray-600">
          {completed}/{total}
        </span>
      </div>
      
      <p className="text-sm text-gray-600">
        {remainingMatches === 0 
          ? '¡Todos los partidos de grupo están completados!' 
          : `Faltan ${remainingMatches} partidos por completar`
        }
      </p>
    </div>
  );
} 