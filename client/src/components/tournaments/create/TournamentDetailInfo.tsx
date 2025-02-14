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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!tournamentInfo.time_slots || tournamentInfo.time_slots.length === 0) {
      toast({
        title: "Error",
        description: "Debe agregar al menos un horario disponible",
        variant: "destructive",
      })
      return
    }

    // Validar que haya seleccionado canchas
    if (!tournamentInfo.courts_available || tournamentInfo.courts_available.length === 0) {
      toast({
        title: "Error",
        description: "Debe seleccionar al menos una cancha",
        variant: "destructive",
      })
      return
    }

    // Validar campos requeridos
    if (!tournamentInfo.rules?.trim()) {
      toast({
        title: "Error",
        description: "Debe ingresar las reglas del torneo",
        variant: "destructive",
      })
      return
    }

    if (!tournamentInfo.tournament_club_name?.trim()) {
      toast({
        title: "Error",
        description: "Debe ingresar el nombre del club",
        variant: "destructive",
      })
      return
    }

    onSubmit(e)
  }

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="space-y-8">
        {/* Sección de Canchas */}
        <div className="bg-blue-50/50 p-6 rounded-lg border border-blue-100 shadow-sm">
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
                className="w-full justify-between mt-2 bg-white border-blue-200 hover:bg-blue-50/50"
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
        </div>

        {/* Sección de Time Slots */}
        <div className="bg-blue-50/50 p-6 rounded-lg border border-blue-100 shadow-sm mt-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Horarios Disponibles</h3>
              <p className="text-sm text-blue-700 mt-1">
                Configura hasta 3 franjas horarias para los partidos del torneo.
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
                      "w-full justify-start text-left font-normal bg-white border-purple-200 hover:bg-purple-50/50",
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
          <div>
            <Label htmlFor="rules">Reglas del Torneo</Label>
            <Textarea
              id="rules"
              value={tournamentInfo.rules}
              onChange={(e) => setTournamentInfo({ ...tournamentInfo, rules: e.target.value })}
              placeholder="Ingrese las reglas del torneo"
              className="mt-2"
              rows={4}
            />
          </div>

          {/* Ubicación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tournament_club_name">Club</Label>
              <Input
                id="tournament_club_name"
                value={tournamentInfo.tournament_club_name}
                onChange={(e) => setTournamentInfo({ ...tournamentInfo, tournament_club_name: e.target.value })}
                placeholder="Nombre del club"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="tournament_location">Ubicación</Label>
              <Input
                id="tournament_location"
                value={tournamentInfo.tournament_location}
                onChange={(e) => setTournamentInfo({ ...tournamentInfo, tournament_location: e.target.value })}
                placeholder="Departamento"
                className="mt-2"
              />
            </div>
          </div>

          {/* Dirección */}
          <div>
            <Label htmlFor="tournament_address">Dirección</Label>
            <Input
              id="tournament_address"
              value={tournamentInfo.tournament_address}
              onChange={(e) => setTournamentInfo({ ...tournamentInfo, tournament_address: e.target.value })}
              placeholder="Dirección completa"
              className="mt-2"
            />
          </div>
        </div>

        {/* Sección de botones mejorada */}
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