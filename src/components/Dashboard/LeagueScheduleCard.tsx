import { CalendarDays, Clock, ChevronLeft, ChevronRight, ListFilter } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { useRouter } from "next/navigation";
import { EmptySchedule } from "./EmptySchedule";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCategories } from "@/hooks/useCategories";

interface Match {
  id: string;
  category_id: string;
  category_name: string;
  team1: string;
  team2: string;
  match_date: string;
  court: string;
  status: "SCHEDULED" | "COMPLETED" | "WALKOVER";
  team1_sets1_won: number;
  team1_sets2_won: number;
  team2_sets1_won: number;
  team2_sets2_won: number;
}

interface LeagueScheduleCardProps {
  leagueId?: string;
}

export function LeagueScheduleCard({ leagueId }: LeagueScheduleCardProps) {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching matches with leagueId:', leagueId);
        
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
        const url = `${baseUrl}/leagues/matches/league/${leagueId || 'all'}`;
        console.log('Fetching from URL:', url);

        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          console.error('Response error:', {
            status: response.status,
            statusText: response.statusText,
            errorData
          });
          throw new Error(
            errorData?.message || 
            `Error al cargar los partidos: ${response.status} ${response.statusText}`
          );
        }
        
        const data = await response.json();
        console.log('Received data:', data);
        
        if (!data) {
          throw new Error('No se recibieron datos del servidor');
        }

        const pendingMatches = Array.isArray(data.pending) ? data.pending : [];
        
        const scheduledMatches = pendingMatches
          .filter((match: Match) => match.status === "SCHEDULED")
          .sort((a: Match, b: Match) => 
            new Date(a.match_date).getTime() - new Date(b.match_date).getTime()
          );
        
        console.log('Scheduled matches:', scheduledMatches);
        setMatches(scheduledMatches);
      } catch (err) {
        console.error('Error in fetchMatches:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, [leagueId]);

  // Efecto para filtrar los partidos cuando cambia la categoría seleccionada
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredMatches(matches);
    } else {
      const filtered = matches.filter(match => match.category_id === selectedCategory);
      setFilteredMatches(filtered);
    }
    setCurrentPage(0); // Reset page when changing category
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [selectedCategory, matches]);

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      time: new Intl.DateTimeFormat('es', {  
        hour: '2-digit',
        minute: '2-digit'
      }).format(date),
      date: new Intl.DateTimeFormat('es', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      }).format(date)
    };
  };

  const totalPages = Math.ceil(filteredMatches.length / 4);

  const handlePrevious = () => {
    if (sliderRef.current && currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      sliderRef.current.scrollTo({
        left: newPage * sliderRef.current.offsetWidth,
        behavior: 'smooth'
      });
    }
  };

  const handleNext = () => {
    if (sliderRef.current && currentPage < totalPages - 1) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      sliderRef.current.scrollTo({
        left: newPage * sliderRef.current.offsetWidth,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (sliderRef.current) {
      const newPage = Math.round(e.currentTarget.scrollLeft / e.currentTarget.offsetWidth);
      setCurrentPage(newPage);
    }
  };

  if (isLoading || isLoadingCategories) {
    return (
      <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 min-h-[200px] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
        <p className="text-red-500 dark:text-red-400 text-center">
          {error}
        </p>
      </div>
    );
  }

  if (!matches.length) {
    return <EmptySchedule />;
  }

  if (filteredMatches.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
        {/* Category Tabs */}
        <div className="px-6 pt-4">
          <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="mb-4">
              <TabsTrigger value="all" className="text-sm">
                Todas las categorías
              </TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="text-sm"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="w-24 h-24 mb-4 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <CalendarDays className="w-12 h-12 text-purple-500 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No hay partidos programados
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-sm">
            {selectedCategory === 'all' 
              ? 'No hay partidos programados en ninguna categoría.'
              : `No hay partidos programados para la categoría ${categories.find(cat => cat.id === selectedCategory)?.name || ''}.`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
      {leagueId && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-700/50 flex justify-end">
          <button
            onClick={() => router.push(`/leagues/${leagueId}/matches`)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white
                     bg-gradient-to-r from-purple-500 to-purple-600 
                     hover:from-purple-600 hover:to-purple-700
                     rounded-lg transition-all duration-200
                     shadow-lg shadow-purple-500/20 dark:shadow-purple-900/30"
          >
            <ListFilter className="w-4 h-4" />
            Ver todos los partidos
          </button>
        </div>
      )}

      {/* Category Tabs */}
      <div className="px-6 pt-4">
        <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="mb-4">
            <TabsTrigger value="all" className="text-sm">
              Todas las categorías
            </TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="text-sm"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      <div className="relative">
        {/* Navigation Buttons */}
        {currentPage > 0 && (
          <button
            onClick={handlePrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full
                     bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm
                     border border-gray-200 dark:border-gray-700
                     text-gray-700 dark:text-gray-200
                     hover:bg-white dark:hover:bg-slate-700
                     transition-all duration-200
                     shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        
        {currentPage < totalPages - 1 && (
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full
                     bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm
                     border border-gray-200 dark:border-gray-700
                     text-gray-700 dark:text-gray-200
                     hover:bg-white dark:hover:bg-slate-700
                     transition-all duration-200
                     shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Cards Container */}
        <div 
          ref={sliderRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {Array.from({ length: totalPages }).map((_, pageIndex) => (
            <div 
              key={pageIndex}
              className="flex-none w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-6 p-6 snap-start"
            >
              {filteredMatches.slice(pageIndex * 4, (pageIndex + 1) * 4).map((match) => (
                <div 
                  key={match.id}
                  className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1D283A]/80 dark:to-[#1D283A] 
                           rounded-2xl p-5 hover:shadow-xl transition-all duration-300
                           border border-gray-200/50 dark:border-gray-700/30
                           backdrop-blur-sm"
                >
                  {/* Categoría Badge */}
                  <div className="absolute -top-3 left-4">
                    <span className="px-3 py-1 rounded-full text-sm font-medium
                                 bg-gradient-to-r from-purple-500 to-purple-600 
                                 text-white shadow-lg shadow-purple-500/30
                                 dark:from-purple-600 dark:to-purple-700
                                 dark:shadow-purple-900/30">
                      {match.category_name}
                    </span>
                  </div>

                  {/* Court Badge */}
                  <div className="absolute -top-3 right-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium
                                 bg-gray-900/5 dark:bg-white/5 
                                 text-gray-700 dark:text-gray-300
                                 border border-gray-200/50 dark:border-gray-700/30">
                      {match.court || 'Sin asignar'}
                    </span>
                  </div>

                  {/* Match Content */}
                  <div className="mt-4 space-y-6">
                    {/* Teams */}
                    <div className="space-y-4">
                      {/* Team 1 */}
                      <div className="flex items-center justify-between space-x-2">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate" title={match.team1}>
                            {match.team1}
                          </p>
                        </div>
                      </div>

                      {/* VS Divider */}
                      <div className="flex items-center justify-center">
                        <div className="relative w-full">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-gray-700/30"></div>
                          </div>
                          <div className="relative flex justify-center">
                            <span className="px-3 text-sm font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 
                                         text-white rounded-full py-1 shadow-lg shadow-emerald-500/20
                                         dark:shadow-emerald-900/30">
                              VS
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Team 2 */}
                      <div className="flex items-center justify-between space-x-2">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate" title={match.team2}>
                            {match.team2}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Date and Time */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/30">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {formatDateTime(match.match_date).time}h
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CalendarDays className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {formatDateTime(match.match_date).date}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 py-4">
            {Array.from({ length: totalPages }).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  currentPage === index
                    ? 'bg-purple-600 dark:bg-purple-500 w-4'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 