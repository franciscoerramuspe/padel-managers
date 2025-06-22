"use client"

import { ArrowLeft } from "lucide-react"
import type { League } from "@/types/league"
import type { Category } from "@/hooks/useCategories"
import { getCategoryName } from "@/utils/category"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface LeagueHeaderProps {
  league: League
  categories: Category[]
  onBack: () => void
}

export function LeagueHeader({ league, categories, onBack }: LeagueHeaderProps) {
  const categoryName =
    league.category_id && categories ? getCategoryName(league.category_id, categories) : "Categoría no especificada"

  return (
    <div className="bg-white dark:bg-[#0E1629] border-b border-gray-200 dark:border-[#1D283A]">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a ligas
            </Button>

            <div className="flex items-center gap-3">
              <Badge 
                variant="outline" 
                className="border-purple-200 dark:border-purple-500/20 bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 px-4 py-1.5 text-sm font-medium shadow-[0_2px_10px] shadow-purple-100 dark:shadow-purple-500/20"
              >
                {categoryName}
              </Badge>
              <Badge 
                variant="outline"
                className={cn(
                  "px-4 py-1.5 text-sm font-medium shadow-[0_2px_10px]",
                  league.status === "upcoming" && "border-blue-200 dark:border-blue-500/20 bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 shadow-blue-100 dark:shadow-blue-500/20",
                  league.status === "in_progress" && "border-green-200 dark:border-green-500/20 bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 shadow-green-100 dark:shadow-green-500/20",
                  league.status === "finished" && "border-orange-200 dark:border-orange-500/20 bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 shadow-orange-100 dark:shadow-orange-500/20"
                )}
              >
                {league.status === "upcoming"
                  ? "Próxima"
                  : league.status === "in_progress"
                    ? "En Curso"
                    : "Finalizada"}
              </Badge>
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
              {league.name}
            </h1>
          </div>
        </div>
      </div>
    </div>
  )
}
