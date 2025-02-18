import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TimeSlot, TournamentInfo } from "@/types/tournament"
import { useCourts } from "@/hooks/useCourts"
import { Command, CommandGroup, CommandInput } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronsUpDown } from "lucide-react"
import { useState } from "react"
import { MapPin, Trophy, Info, Clock, ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { format, startOfDay } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { es } from "date-fns/locale"
import { TimeSlots } from "@/components/Tournaments/create/TimeSlots"
import { toast } from "@/components/ui/use-toast"

interface TournamentDetailInfoProps {
  tournamentInfo: TournamentInfo
  setTournamentInfo: (info: TournamentInfo) => void
  onSubmit: (e: React.FormEvent) => void
  onBack: () => void
}

export function TournamentDetailInfo({
  tournamentInfo,
  setTournamentInfo,
  onSubmit,
  onBack
}: TournamentDetailInfoProps) {
  const { courts, isLoading } = useCourts()
  const [searchQuery, setSearchQuery] = useState("")
  const [errors, setErrors] = useState<{
    courts_available?: boolean;
    time_slots?: boolean;
    rules?: boolean;
    tournament_club_name?: boolean;
    tournament_location?: boolean;
    tournament_address?: boolean;
    signup_limit_date?: boolean;
  }>({})

  const handleCourtToggle = (courtId: string) => {
    const currentCourts = tournamentInfo.courts_available || []
    const updatedCourts = currentCourts.includes(courtId)
      ? currentCourts.filter(id => id !== courtId)
      : [...currentCourts, courtId]
    
    setTournamentInfo({ ...tournamentInfo, courts_available: updatedCourts })
  }

  const handleSelectAllCourts = () => {
    const allCourtIds = courts.map(court => court.id)
    setTournamentInfo({ 
      ...tournamentInfo, 
      courts_available: tournamentInfo.courts_available?.length === courts.length ? [] : allCourtIds 
    })
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setTournamentInfo({ 
        ...tournamentInfo, 
        signup_limit_date: format(date, 'yyyy-MM-dd')
      })
    } else {
      setTournamentInfo({ 
        ...tournamentInfo, 
        signup_limit_date: '' 
      })
    }
  }

  const validateForm = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors = {
      courts_available: !tournamentInfo.courts_available?.length,
      time_slots: !tournamentInfo.time_slots?.length,
      rules: !tournamentInfo.rules?.trim(),
      tournament_club_name: !tournamentInfo.tournament_club_name?.trim(),
      tournament_location: !tournamentInfo.tournament_location?.trim(),
      tournament_address: !tournamentInfo.tournament_address?.trim(),
      signup_limit_date: !tournamentInfo.signup_limit_date?.trim(),
    }

    setErrors(newErrors)

    // Si no hay errores, continuamos
    if (!Object.values(newErrors).some(Boolean)) {
      onSubmit(e)
    } else {
      toast({
        title: "Error",
        description: "Por favor, complete todos los campos requeridos",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={validateForm} className="p-6">
      <div className="space-y-8">
        {/* Sección de Canchas */}
        <div className={cn(
          "bg-blue-50/50 p-6 rounded-lg border shadow-sm",
          errors.courts_available ? "border-red-300" : "border-blue-100"
        )}>
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Canchas Disponibles</h3>
              <p className="text-sm text-blue-700 mt-1">
                Selecciona las canchas que estarán disponibles para este torneo. 
                Este paso es obligatorio para la creación del torneo.
              </p>
            </div>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "w-full justify-between mt-2 bg-white",
                  errors.courts_available ? "border-red-500 hover:bg-red-50/50" : "border-blue-200 hover:bg-blue-50/50"
                )}
              >
                {tournamentInfo.courts_available?.length && tournamentInfo.courts_available.length > 0
                  ? `${tournamentInfo.courts_available.length} canchas seleccionadas`
                  : "Seleccionar canchas"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command className="border-none">
                <CommandInput 
                  placeholder="Buscar cancha..." 
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  className="border-none focus:ring-0"
                />
                <CommandGroup>
                  {courts?.length > 0 ? (
                    <>
                      <div 
                        className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-blue-50"
                        onClick={handleSelectAllCourts}
                      >
                        <Checkbox
                          checked={tournamentInfo.courts_available?.length === courts.length}
                          className="border-blue-400 data-[state=checked]:bg-blue-600"
                        />
                        <span className="font-medium">Seleccionar todas</span>
                      </div>
                      <div className="py-2">
                        {courts.map((court) => (
                          <div
                            key={court.id}
                            className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-blue-50"
                            onClick={() => handleCourtToggle(court.id)}
                          >
                            <Checkbox
                              checked={tournamentInfo.courts_available?.includes(court.id)}
                              className="border-blue-400 data-[state=checked]:bg-blue-600"
                            />
                            <span>{court.name}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="px-3 py-6 text-sm text-gray-500 text-center">
                      {isLoading ? "Cargando canchas..." : "No hay canchas disponibles"}
                    </div>
                  )}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          {errors.courts_available && (
            <p className="text-sm text-red-500 mt-2">
              Debe seleccionar al menos una cancha
            </p>
          )}
        </div>

        {/* Sección de Time Slots */}
        <div className={cn(
          "bg-blue-50/50 p-6 rounded-lg border shadow-sm",
          errors.time_slots ? "border-red-300" : "border-blue-100"
        )}>
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Horarios del Torneo</h3>
              <p className="text-sm text-blue-700 mt-1">
                Configura los horarios para cada día del torneo (viernes a domingo). Puedes asignar un horario diferente para cada día.
              </p>
            </div>
          </div>

          <TimeSlots
            timeSlots={tournamentInfo.time_slots || []} 
            onChange={(slots) => {
              setTournamentInfo({
                ...tournamentInfo,
                time_slots: slots
              })
            }}
          />
          {errors.time_slots && (
            <p className="text-sm text-red-500 mt-2">
              Debe agregar al menos un horario disponible
            </p>
          )}
        </div>

        {/* Sección de Fechas y Costos */}
        <div className="bg-purple-50/50 p-6 rounded-lg border border-purple-100 shadow-sm">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-full">
              <CalendarIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-900">Fechas y Costos</h3>
              <p className="text-sm text-purple-700 mt-1">
                Establece los costos de inscripción y las fechas límite para el torneo.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-purple-900 font-medium">
                Costo de Inscripción
              </Label>
              <Input
                type="number"
                value={tournamentInfo.inscription_cost}
                onChange={(e) => setTournamentInfo({ 
                  ...tournamentInfo, 
                  inscription_cost: Number(e.target.value) 
                })}
                placeholder="0.00"
                className="bg-white border-purple-200 focus-visible:ring-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-purple-900 font-medium">
                Fecha Límite de Inscripción
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-white",
                      errors.signup_limit_date ? "border-red-500" : "border-purple-200 hover:bg-purple-50/50",
                      !tournamentInfo.signup_limit_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {tournamentInfo.signup_limit_date ? (
                      format(new Date(tournamentInfo.signup_limit_date + 'T12:00:00'), "PPP", { locale: es })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={tournamentInfo.signup_limit_date ? new Date(tournamentInfo.signup_limit_date + 'T12:00:00') : undefined}
                    onSelect={handleDateSelect}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
              {errors.signup_limit_date && (
                <p className="text-sm text-red-500 mt-1">
                  La fecha límite de inscripción es requerida
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sección de Premios */}
        <div className="bg-green-50 p-6 rounded-lg border border-green-100">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-full">
              <Trophy className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-900">Premios del Torneo</h3>
              <p className="text-sm text-green-700 mt-1">
                Define los premios para los primeros lugares del torneo.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="first_place_prize">Premio para primer lugar</Label>
              <Input
                id="first_place_prize"
                value={tournamentInfo.first_place_prize}
                onChange={(e) => setTournamentInfo({ 
                  ...tournamentInfo, 
                  first_place_prize: e.target.value 
                })}
                placeholder="Premio"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="second_place_prize">Premio para segundo lugar</Label>
              <Input
                id="second_place_prize"
                value={tournamentInfo.second_place_prize}
                onChange={(e) => setTournamentInfo({ 
                  ...tournamentInfo, 
                  second_place_prize: e.target.value 
                })}
                placeholder="Premio"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="third_place_prize">Premio para tercer lugar</Label>
              <Input
                id="third_place_prize"
                value={tournamentInfo.third_place_prize}
                onChange={(e) => setTournamentInfo({ 
                  ...tournamentInfo, 
                  third_place_prize: e.target.value 
                })}
                placeholder="Premio"
                className="mt-2"
              />
            </div>
          </div>
        </div>

        {/* Sección de Información General */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-gray-100 rounded-full">
              <Info className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Información Adicional</h3>
              <p className="text-sm text-gray-700 mt-1">
                Completa la información general del torneo.
              </p>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <Label htmlFor="description">Descripción del Torneo</Label>
            <Textarea
              id="description"
              value={tournamentInfo.description}
              onChange={(e) => setTournamentInfo({ ...tournamentInfo, description: e.target.value })}
              placeholder="Ingrese una descripción detallada del torneo"
              className="mt-2"
              rows={4}
            />
          </div>

          {/* Reglas */}
          <div className="space-y-2">
            <Label htmlFor="rules">Reglas del Torneo</Label>
            <Textarea
              id="rules"
              value={tournamentInfo.rules}
              onChange={(e) => setTournamentInfo({ ...tournamentInfo, rules: e.target.value })}
              placeholder="Ingrese las reglas del torneo"
              className={cn(
                "mt-2",
                errors.rules && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {errors.rules && (
              <p className="text-sm text-red-500">
                Las reglas del torneo son requeridas
              </p>
            )}
          </div>

          {/* Ubicación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label htmlFor="tournament_club_name">Club</Label>
              <Input
                id="tournament_club_name"
                value={tournamentInfo.tournament_club_name}
                onChange={(e) => setTournamentInfo({ ...tournamentInfo, tournament_club_name: e.target.value })}
                placeholder="Nombre del club"
                className={cn(
                  "mt-2",
                  errors.tournament_club_name && "border-red-500 focus-visible:ring-red-500"
                )}
              />
              {errors.tournament_club_name && (
                <p className="text-sm text-red-500 mt-1">
                  El nombre del club es requerido
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="tournament_location">Ubicación</Label>
              <Input
                id="tournament_location"
                value={tournamentInfo.tournament_location}
                onChange={(e) => setTournamentInfo({ ...tournamentInfo, tournament_location: e.target.value })}
                placeholder="Departamento"
                className={cn(
                  "mt-2",
                  errors.tournament_location && "border-red-500 focus-visible:ring-red-500"
                )}
              />
              {errors.tournament_location && (
                <p className="text-sm text-red-500 mt-1">
                  La ubicación es requerida
                </p>
              )}
            </div>
          </div>

          {/* Dirección */}
          <div className="mt-4">
            <Label htmlFor="tournament_address">Dirección</Label>
            <Input
              id="tournament_address"
              value={tournamentInfo.tournament_address}
              onChange={(e) => setTournamentInfo({ ...tournamentInfo, tournament_address: e.target.value })}
              placeholder="Dirección completa"
              className={cn(
                "mt-2",
                errors.tournament_address && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {errors.tournament_address && (
              <p className="text-sm text-red-500 mt-1">
                La dirección es requerida
              </p>
            )}
          </div>
        </div>

        {/* Sección de botones */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
            <Button 
              type="button" 
              variant="outline"
              onClick={onBack}
              size="lg"
              className="flex-1 text-base font-medium border-2 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al paso anterior
            </Button>
            <Button 
              type="submit" 
              size="lg"
              className="flex-1 text-base font-medium bg-blue-500 hover:bg-blue-600 text-white"
            >
              Crear Torneo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">
            Revisa todos los datos antes de crear el torneo
          </p>
        </div>
      </div>
    </form>
  )
} 