interface TournamentStatusProps {
  category: string;
  status: string;
}

export function TournamentStatus({ category, status }: TournamentStatusProps) {
  return (
    <div className="flex items-center gap-4">
      <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm">
        {category}
      </span>
      <span className={`px-3 py-1 rounded-full text-sm font-medium
        ${status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
          status === 'in_progress' ? 'bg-green-100 text-green-800' :
          'bg-gray-100 text-gray-800'}`}>
        {status === 'upcoming' ? 'Próximo' :
         status === 'in_progress' ? 'En Curso' : 'Finalizado'}
      </span>
    </div>
  );
} 