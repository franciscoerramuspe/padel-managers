import { Search } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
}

export const EmptyState = ({ message = "No se encontraron torneos" }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-gray-100 rounded-full p-4 mb-4">
        <Search className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">
        Sin resultados
      </h3>
      <p className="text-gray-500">
        {message}
      </p>
    </div>
  );
}; 

