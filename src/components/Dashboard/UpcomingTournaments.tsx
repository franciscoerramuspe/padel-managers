import Link from 'next/link';
import { useState, useMemo } from 'react';
import TournamentCard from './TournamentCard';
import { Tournament } from '@/types/tournament';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface UpcomingTournamentsProps {
  tournaments: Tournament[];
}

export function UpcomingTournaments({ tournaments }: UpcomingTournamentsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const tournamentsPerPage = 3;
  
  // Memoizamos los torneos próximos para evitar recálculos innecesarios
  const upcomingTournaments = useMemo(() => 
    tournaments.filter(t => t.status === 'upcoming'),
    [tournaments]
  );
  
  // Memoizamos los cálculos de paginación
  const { totalPages, currentTournaments } = useMemo(() => {
    const total = Math.ceil(upcomingTournaments.length / tournamentsPerPage);
    const indexOfLast = currentPage * tournamentsPerPage;
    const indexOfFirst = indexOfLast - tournamentsPerPage;
    const current = upcomingTournaments.slice(indexOfFirst, indexOfLast);

    return {
      totalPages: total,
      currentTournaments: current
    };
  }, [upcomingTournaments, currentPage, tournamentsPerPage]);

  // Memoizamos los números de página
  const pageNumbers = useMemo(() => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }, [totalPages]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Próximos Torneos
        </h2>
        <Link 
          href="/tournaments"
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
        >
          Ver todos
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {currentTournaments.map((tournament) => (
          <TournamentCard 
            key={tournament.id}
            tournament={tournament}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                className={cn(
                  "cursor-pointer",
                  currentPage === 1 && "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>

            {pageNumbers.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext 
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                className={cn(
                  "cursor-pointer",
                  currentPage === totalPages && "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
} 