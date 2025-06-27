import { Progress } from '@/components/ui/progress';
import { Users2, Trophy, Calendar, Clock, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { League } from '@/types/league';
import { Category } from '@/hooks/useCategories';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { EmptyLeagues } from './EmptyLeagues';
import { CategoryFilterTabs } from './CategoryFilterTabs';
import Image from 'next/image';

interface LeagueRegistrationProgressProps {
  leagues: League[];
  categories: Category[];
}

export function LeagueRegistrationProgress({ leagues, categories }: LeagueRegistrationProgressProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const sliderRef = useRef<HTMLDivElement>(null);

  // Si no hay ligas, mostrar el componente EmptyLeagues
  if (!leagues || leagues.length === 0) {
    return <EmptyLeagues />;
  }

  // Filtrar ligas por categoría seleccionada
  const filteredLeagues = selectedCategory === 'all'
    ? leagues
    : leagues.filter(league => league.category_id === selectedCategory);

  const CARDS_PER_PAGE = 3;
  const totalPages = Math.ceil(filteredLeagues.length / CARDS_PER_PAGE);
  const showSlider = filteredLeagues.length > CARDS_PER_PAGE;

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

  if (filteredLeagues.length === 0) {
    return (
      <div className="space-y-6">
        <CategoryFilterTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          className="px-0"
        />

        <EmptyLeagues />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CategoryFilterTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        className="px-0"
      />

      <div className="relative">
        {/* Navigation Buttons */}
        {showSlider && currentPage > 0 && (
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
        
        {showSlider && currentPage < totalPages - 1 && (
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
          className={`${
            showSlider 
              ? 'flex overflow-x-auto snap-x snap-mandatory scrollbar-hide' 
              : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
          }`}
          style={showSlider ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : undefined}
        >
          {showSlider ? (
            // Slider view
            Array.from({ length: totalPages }).map((_, pageIndex) => (
              <div 
                key={pageIndex}
                className="flex-none w-full grid grid-cols-1 md:grid-cols-3 gap-4 snap-start"
              >
                {filteredLeagues
                  .slice(pageIndex * CARDS_PER_PAGE, (pageIndex + 1) * CARDS_PER_PAGE)
                  .map((league) => (
                    <LeagueCard 
                      key={league.id} 
                      category={categories.find(cat => cat.id === league.category_id)!} 
                      league={league} 
                    />
                  ))}
              </div>
            ))
          ) : (
            // Grid view
            filteredLeagues.map((league) => (
              <LeagueCard 
                key={league.id} 
                category={categories.find(cat => cat.id === league.category_id)!} 
                league={league} 
              />
            ))
          )}
        </div>

        {/* Pagination Dots */}
        {showSlider && totalPages > 1 && (
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

// Componente de tarjeta extraído para mejor organización
function LeagueCard({ category, league }: { category: Category; league: League }) {
  const registeredTeams = league.registeredTeams || 0;
  const availableSpots = league.team_size - registeredTeams;
  const registrationProgress = (registeredTeams / league.team_size) * 100;
  
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Inscribiendo':
        return {
          text: 'Inscripciones Abiertas',
          style: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300'
        };
      case 'Activa':
        return {
          text: 'En Curso',
          style: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300'
        };
      case 'Finalizada':
        return {
          text: 'Finalizada',
          style: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
        };
      default:
        return {
          text: 'Inscripciones Cerradas',
          style: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
        };
    }
  };

  const statusInfo = getStatusStyle(league.status);

  return (
    <Card className="bg-white dark:bg-slate-800/50 border-gray-200 dark:border-gray-700/50 overflow-hidden">
      {/* Header con categoría y estado */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
              CATEGORÍA
            </span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {category?.name || 'Categoría no disponible'}
            </span>
          </div>
          <span 
            className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.style}`}
          >
            {statusInfo.text}
          </span>
        </div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{league.name}</h4>
      </div>

      {/* Imagen de la liga */}
      {league.image_url && (
        <div className="relative aspect-square w-full max-h-[200px]">
          <Image
            src={league.image_url}
            alt={league.name}
            fill
            className="object-cover rounded-md"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Contenido */}
      <div className="p-4 space-y-4">
        {/* Fecha de inicio */}
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Fecha de inicio</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {(() => {
                  const [year, month, day] = league.start_date.split('T')[0].split('-').map(Number);
                  const date = new Date(year, month - 1, day);
                  return date.toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  });
                })()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Fecha de fin</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {(() => {
                  const [year, month, day] = league.end_date.split('T')[0].split('-').map(Number);
                  const date = new Date(year, month - 1, day);
                  return date.toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  });
                })()}
              </p>
            </div>
          </div>
        </div>

        {/* Equipos registrados */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Equipos registrados
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {registeredTeams} / {league.team_size}
            </span>
          </div>
          <Progress 
            value={registrationProgress} 
            className="h-1 bg-gray-100 dark:bg-gray-700/50" 
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {Math.round(registrationProgress)}% completado
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {availableSpots} cupos disponibles
            </span>
          </div>
        </div>

        {/* Frecuencia */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Frecuencia: {league.frequency === 'biweekly' ? 'quincenal' : league.frequency}</span>
        </div>

        {/* Botón Ver Detalles */}
        <Link 
          href={`/leagues/${league.id}`}
          className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 
                   bg-purple-50 dark:bg-purple-500/10 
                   hover:bg-purple-100 dark:hover:bg-purple-500/20 
                   text-purple-600 dark:text-purple-400 
                   hover:text-purple-700 dark:hover:text-purple-300
                   border border-purple-200 dark:border-purple-800/30 
                   hover:border-purple-300 dark:hover:border-purple-700/30
                   rounded-lg transition-all duration-200"
        >
          Ver detalles
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </Card>
  );
} 