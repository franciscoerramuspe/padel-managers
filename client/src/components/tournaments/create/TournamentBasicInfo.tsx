import { Button } from "@/components/ui/button"
import { Command, CommandGroup, CommandInput, CommandEmpty } from "@/components/ui/command"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { ChevronsUpDown, CalendarIcon } from "lucide-react"
import { format, parseISO, startOfDay } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Category, FormData } from "@/types/tournament"
import { useState } from "react"


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

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCategoryToggle = (categoryId: string) => {
    const newCategoryIds = formData.category_ids.includes(categoryId)
      ? formData.category_ids.filter((id: string) => id !== categoryId)
      : [...formData.category_ids, categoryId]
    setFormData({ ...formData, category_ids: newCategoryIds })
  }

  const handleSelectAll = () => {
    const allSelected = formData.category_ids.length === categories.length
    setFormData({
      ...formData,
      category_ids: allSelected ? [] : categories.map(category => category.id)
    })
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
    <form onSubmit={onSubmit}>
      <div className="space-y-6">
        {/* Nombre del Torneo */}
        <div>
          <Label htmlFor="name">Nombre del Torneo</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ingrese el nombre del torneo"
            className="mt-2"
          />
        </div>

        {/* Categorías */}
        <div>
          <Label>Categorías</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between mt-2"
              >
                {formData.category_ids.length > 0
                  ? `${formData.category_ids.length} categorías seleccionadas`
                  : "Seleccionar categorías"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
              
                <CommandInput 
                  placeholder="Buscar categoría..." 
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                <CommandGroup>
                  {categories.length > 0 ? (
                    <>
                      <div 
                        className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-gray-100"
                        onClick={handleSelectAll}
                      >
                        <Checkbox
                          checked={formData.category_ids.length === categories.length}
                        />
                        <span>Seleccionar todas</span>
                      </div>
                      {filteredCategories.map((category) => (
                        <div
                          key={category.id}
                          className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-gray-100"
                          onClick={() => handleCategoryToggle(category.id)}
                        >
                          <Checkbox
                            checked={formData.category_ids.includes(category.id)}
                          />
                          <span>{category.name}</span>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="px-2 py-4 text-sm text-gray-500 text-center">
                      No hay categorías disponibles
                    </div>
                  )}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="start_date">Fecha de Inicio</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
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

          <div className="flex flex-col space-y-2">
            <Label htmlFor="end_date">Fecha de Finalización</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
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

        <Button type="submit" className="w-full">
          Siguiente Paso
        </Button>
      </div>
    </form>
  )
}