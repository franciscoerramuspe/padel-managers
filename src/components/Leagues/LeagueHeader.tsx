"use client"

import { ArrowLeft } from "lucide-react"
import type { League } from "@/types/league"
import type { Category } from "@/hooks/useCategories"
import { getCategoryName } from "@/utils/category"

interface LeagueHeaderProps {
  league: League
  categories: Category[]
  onBack: () => void
}

export function LeagueHeader({ league, categories, onBack }: LeagueHeaderProps) {
  const categoryName =
    league.category_id && categories ? getCategoryName(league.category_id, categories) : "Categoría no especificada"

  return (
    <div className="relative">
      {/* Banner con gradiente */}
      <div className="relative h-[300px]">
        <div className="h-full bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800 animate-gradient-x" />
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

        {/* Pattern overlay for texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      {/* Contenido del header */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <button
            onClick={onBack}
            className="mb-6 inline-flex items-center text-sm text-white/80 hover:text-white transition-colors duration-200 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a ligas
          </button>

          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6 drop-shadow-md">{league.name}</h1>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="px-5 py-2 rounded-full bg-purple-500/40 text-purple-50 text-sm font-medium border border-purple-400/30 backdrop-blur-sm shadow-md">
                {categoryName}
              </span>
              <span
                className={`px-5 py-2 rounded-full text-sm font-medium backdrop-blur-sm shadow-md ${
                  league.status === "upcoming"
                    ? "bg-blue-500/40 text-blue-50 border border-blue-400/30"
                    : league.status === "in_progress"
                      ? "bg-green-500/40 text-green-50 border border-green-400/30"
                      : "bg-gray-500/40 text-gray-50 border border-gray-400/30"
                }`}
              >
                {league.status === "upcoming"
                  ? "Próxima"
                  : league.status === "in_progress"
                    ? "En Curso"
                    : league.status
                      ? "Finalizada"
                      : "Estado no definido"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
