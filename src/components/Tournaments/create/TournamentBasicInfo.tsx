import { Button } from "@/components/ui/button"
import { Command, CommandGroup, CommandInput, CommandEmpty, CommandItem } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { ChevronsUpDown, CalendarIcon, Trophy, ArrowRight } from "lucide-react"
import { format, parseISO, startOfDay } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Category, FormData } from "@/types/tournament"
import { useState } from "react"
import { Check } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"


interface TournamentBasicInfoProps {
  formData: FormData
  setFormData: (data: FormData) => void
  categories: Category[]
  onSubmit: (e: React.FormEvent) => void
}

export function TournamentBasicInfo({ 
  formData, 
  setFormData, 
  categories,
  onSubmit 
}: TournamentBasicInfoProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleCategoryToggle = (categoryId: string) => {
    const currentCategories = formData.category_ids || []
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter(id => id !== categoryId)
      : [...currentCategories, categoryId]
    setFormData({ ...formData, category_ids: newCategories })
  }

  const handleSelectAllCategories = () => {
    const allCategoryIds = categories.map(category => category.id)
    setFormData({ ...formData, category_ids: allCategoryIds })
  }

  const handleStartDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      
      setFormData({ 
        ...formData, 
        start_date: formattedDate
      });
    } else {
      setFormData({ ...formData, start_date: "" });
    }
  }

  const handleEndDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");      
      setFormData({ 
        ...formData, 
        end_date: formattedDate
      });
    } else {
      setFormData({ ...formData, end_date: "" });
    }
  }

  return (
    <form onSubmit={onSubmit} className="p-6 space-y-8">
      {/* Sección de Información Básica */}
      <div className="space-y-6">
        <div className="flex items-start gap-3 mb-6">
          <div className="p-2 bg-blue-500 rounded-full">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
            <p className="text-sm text-gray-500 mt-1">
              Ingrese los detalles principales del torneo.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Nombre del Torneo */}
          <div className="col-span-2">
            <Label htmlFor="name" className="text-base font-medium">
              Nombre del Torneo
            </Label>
            <Input
              id="name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ingrese el nombre del torneo"
              className="mt-2"
            />
          </div>

          {/* Categorías con multiselect restaurado */}
          <div className="col-span-2">
            <Label htmlFor="categories" className="text-base font-medium">
              Categorías
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between mt-2"
                >
                  {formData.category_ids?.length > 0
                    ? `${formData.category_ids.length} categorías seleccionadas`
                    : "Seleccionar categorías"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput 
                    placeholder="Buscar categoría..." 
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                  <CommandGroup>
                    <div 
                      className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-primary/10"
                      onClick={handleSelectAllCategories}
                    >
                      <Checkbox
                        checked={formData.category_ids?.length === categories.length}
                        className="border-primary data-[state=checked]:bg-primary"
                      />
                      <span className="font-medium">Seleccionar todas</span>
                    </div>
                    <div className="py-2">
                      {categories.map((category) => (
                        <div
                          key={category.id}
                          className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-primary/10"
                          onClick={() => handleCategoryToggle(category.id)}
                        >
                          <Checkbox
                            checked={formData.category_ids?.includes(category.id)}
                            className="border-primary data-[state=checked]:bg-primary"
                          />
                          <span>{category.name}</span>
                        </div>
                      ))}
                    </div>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Fechas - Manteniendo la lógica original */}
          <div className="space-y-2">
            <Label htmlFor="start_date" className="text-base font-medium">
              Fecha de Inicio
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal mt-2",
                    !formData.start_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.start_date ? (
                    format(new Date(formData.start_date + 'T12:00:00'), "PPP", { locale: es })
                  ) : (
                    <span>Seleccionar fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.start_date ? new Date(formData.start_date + 'T12:00:00') : undefined}
                  onSelect={handleStartDateSelect}
                  initialFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="end_date" className="text-base font-medium">
              Fecha de Finalización
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal mt-2",
                    !formData.end_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.end_date ? (
                    format(new Date(formData.end_date + 'T12:00:00'), "PPP", { locale: es })
                  ) : (
                    <span>Seleccionar fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.end_date ? new Date(formData.end_date + 'T12:00:00') : undefined}
                  onSelect={handleEndDateSelect}
                  initialFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Botón de Siguiente */}
      <div className="pt-6 border-t">
        <Button 
          type="submit" 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          size="lg"
        >
          <ArrowRight className="w-4 h-4 mr-2" />
          Siguiente Paso
        </Button>
      </div>
    </form>
  )
}