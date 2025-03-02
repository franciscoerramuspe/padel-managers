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
import { Category, TournamentFormData } from "@/types/tournament"
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"


interface TournamentBasicInfoProps {
  formData: TournamentFormData;
  setFormData: (data: TournamentFormData) => void;
  categories: Category[];
  onSubmit: (e: React.FormEvent) => void;
}

export function TournamentBasicInfo({ 
  formData, 
  setFormData, 
  categories = [],
  onSubmit 
}: TournamentBasicInfoProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [errors, setErrors] = useState({
    name: false,
    category_id: false,
    start_date: false,
    end_date: false
  })

  const handleCategoryToggle = (categoryId: string) => {
    const selectedCategory = categories.find(cat => cat.id === categoryId);
    if (!selectedCategory) return;

    const currentCategories = formData.categories || [];
    const categoryExists = currentCategories.some(cat => cat.id === categoryId);
    
    const newCategories = categoryExists
      ? currentCategories.filter(cat => cat.id !== categoryId)
      : [...currentCategories, { id: categoryId, name: selectedCategory.name }];

    setFormData({
      ...formData,
      categories: newCategories,
      category_ids: newCategories.map(cat => cat.id)
    });
  };

  const handleSelectAllCategories = () => {
    const allCategories = categories.map(category => ({
      id: category.id,
      name: category.name
    }));
    
    setFormData({
      ...formData,
      categories: allCategories,
      category_ids: allCategories.map(cat => cat.id)
    }); 
    
  };

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const validateForm = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors = {
      name: !formData.name,
      category_id: !formData.category_ids?.length,
      start_date: !formData.start_date,
      end_date: !formData.end_date,
    }

    setErrors(newErrors)

    console.log('Datos del primer paso:', {
      name: formData.name,
      category_ids: formData.category_ids,
      categories: formData.categories,
      start_date: formData.start_date,
      end_date: formData.end_date,
      status: formData.status,
      courts_available: formData.courts_available,
      time_slots: formData.time_slots
    });

    if (!Object.values(newErrors).some(Boolean)) {
      console.log('Formulario válido, pasando al siguiente paso');
      onSubmit(e)
    } else {
      console.log('Errores de validación:', newErrors);
    }
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
    <form onSubmit={validateForm} className="p-6 space-y-8">
      {/* Sección de Información Básica */}
      <div className="space-y-6">
        <div className="flex items-start gap-3 mb-6">
          <div className="p-2 bg-blue-500 dark:bg-blue-600 rounded-full">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Información Básica</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Ingrese los detalles principales del torneo.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Nombre del Torneo */}
          <div className="col-span-2">
            <Label htmlFor="name" className="text-base font-medium text-gray-700 dark:text-gray-300">
              Nombre del Torneo
            </Label>
            <Input
              id="name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ingrese el nombre del torneo"
              className={cn(
                "mt-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600",
                errors.name && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {errors.name && (
              <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                El nombre del torneo es requerido
              </p>
            )}
          </div>

          {/* Categorías con single select */}
          <div className="col-span-2">
            <Label htmlFor="categories" className="text-base font-medium text-gray-700 dark:text-gray-300">
              Categoría
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between mt-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600",
                    errors.category_id && "border-red-500 focus-visible:ring-red-500"
                  )}
                >
                  {formData.categories.map(cat => cat.name).join(', ') || "Seleccionar categoría"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" align="start">
                <Command className="bg-transparent">
                  <CommandInput
                    placeholder="Buscar categoría..."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                    className="border-none focus:ring-0"
                  />
                  <CommandGroup>
                    {categories.length > 0 && (
                      <div 
                        className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-primary/10 dark:hover:bg-primary/20"
                        onClick={handleSelectAllCategories}
                      >
                        <Checkbox
                          checked={formData.categories?.length === categories.length}
                          className="border-primary data-[state=checked]:bg-primary"
                        />
                        <span className="text-xs font-medium text-gray-900 dark:text-gray-200">
                          Seleccionar todas
                        </span>
                      </div>
                    )}
                    <div className="py-2">
                      {filteredCategories.length > 0 ? (
                        filteredCategories.map((category) => (
                          <div
                            key={category.id}
                            className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-primary/10 dark:hover:bg-primary/20"
                            onClick={() => handleCategoryToggle(category.id)}
                          >
                            <Checkbox
                              checked={formData.categories?.some(cat => cat.id === category.id)}
                              className="border-primary data-[state=checked]:bg-primary"
                            />
                            <span className="text-xs text-gray-900 dark:text-gray-200">
                              {category.name}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                          {searchQuery ? 'No se encontraron categorías' : 'No hay categorías disponibles'}
                        </div>
                      )}
                    </div>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.category_id && (
              <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                Debe seleccionar una categoría
              </p>
            )}
          </div>

          {/* Fechas - Manteniendo la lógica original */}
          <div className="space-y-2">
            <Label htmlFor="start_date" className="text-base font-medium text-gray-700 dark:text-gray-300">
              Fecha de Inicio
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal mt-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600",
                    !formData.start_date && "text-muted-foreground dark:text-gray-400",
                    errors.start_date && "border-red-500 focus-visible:ring-red-500"
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
              <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" align="start">
                <Calendar
                  mode="single"
                  selected={formData.start_date ? new Date(formData.start_date + 'T12:00:00') : undefined}
                  onSelect={handleStartDateSelect}
                  initialFocus
                  locale={es}
                  className="dark:bg-gray-800"
                />
              </PopoverContent>
            </Popover>
            {errors.start_date && (
              <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                La fecha de inicio es requerida
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="end_date" className="text-base font-medium text-gray-700 dark:text-gray-300">
              Fecha de Finalización
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal mt-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600",
                    !formData.end_date && "text-muted-foreground dark:text-gray-400",
                    errors.end_date && "border-red-500 focus-visible:ring-red-500"
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
              <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" align="start">
                <Calendar
                  mode="single"
                  selected={formData.end_date ? new Date(formData.end_date + 'T12:00:00') : undefined}
                  onSelect={handleEndDateSelect}
                  initialFocus
                  locale={es}
                  className="dark:bg-gray-800"
                />
              </PopoverContent>
            </Popover>
            {errors.end_date && (
              <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                La fecha de finalización es requerida
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Botón de Siguiente */}
      <div className="pt-6 border-t dark:border-gray-700">
        <Button 
          type="submit" 
          className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
          size="lg"
        >
          <ArrowRight className="w-4 h-4 mr-2" />
          Siguiente Paso
        </Button>
      </div>
    </form>
  )
}