import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {  TournamentInfo } from "@/types/tournament"
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

interface TournamentBase {
  tournament_info: TournamentInfo;
  time_slots: TimeSlot[];
  start_date: string;
  end_date: string;
  // ... otros campos necesarios
}

interface TimeSlot {
  start: string;
  end: string;
  day: string;
  date: string;
  error?: string;
}

interface TournamentDetailInfoProps {
  tournament: TournamentBase & {
    tournament_info: TournamentInfo;
  };
  setTournament: (tournament: TournamentBase & {
    tournament_info: TournamentInfo;
  }) => void;
  onSubmit: (data: any) => void;
  onBack: () => void;
}

export function TournamentDetailInfo({
  tournament,
  setTournament,
  onSubmit,
  onBack
}: TournamentDetailInfoProps) {
  const { courts, isLoading } = useCourts()
  const [selectedCourts, setSelectedCourts] = useState<string[]>([])
  const [errors, setErrors] = useState({
    rules: false,
    tournament_club_name: false,
    tournament_location: false,
    tournament_address: false,
    signup_limit_date: false,
    description: false,
    inscription_cost: false,
    first_place_prize: false,
    selectedCourts: false,
    time_slots: false
  })

  const [tournamentState, setTournamentState] = useState<TournamentBase>({
    ...tournament,
    time_slots: tournament.time_slots || [],
  });

  const handleCourtToggle = (courtId: string) => {
    const newSelectedCourts = selectedCourts.includes(courtId)
      ? selectedCourts.filter(id => id !== courtId)
      : [...selectedCourts, courtId]
    
    setSelectedCourts(newSelectedCourts)
  }

  const handleSelectAllCourts = () => {
    const allCourtIds = courts.map(court => court.id)
    const newSelectedCourts = selectedCourts.length === courts.length ? [] : allCourtIds
    setSelectedCourts(newSelectedCourts)
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setTournamentState({ 
        ...tournamentState, 
        tournament_info: { ...tournamentState.tournament_info, signup_limit_date: format(date, 'yyyy-MM-dd') }
      })
    } else {
      setTournamentState({ 
        ...tournamentState, 
        tournament_info: { ...tournamentState.tournament_info, signup_limit_date: '' }
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (selectedCourts.length === 0) {
        setErrors(prev => ({ ...prev, selectedCourts: true }));
        toast({
          title: "Error",
          description: "Debe seleccionar al menos una cancha",
          variant: "destructive",
        });
        return;
      }

      // Convertir los time_slots al formato que espera el backend
      const formattedTimeSlots = tournamentState.time_slots.map(slot => {
        const startHour = parseInt(slot.start.split(':')[0]);
        const endHour = parseInt(slot.end.split(':')[0]);
        return [startHour, endHour];
      });

      onSubmit({
        ...tournamentState,
        time_slots: formattedTimeSlots,
        courts_available: selectedCourts.length
      });
    } catch (error) {
      console.error('Error creating tournament:', error);
      toast({
        title: "Error",
        description: "Hubo un error al crear el torneo",
        variant: "destructive",
      });
    }
  };

  const validateForm = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors = {
      rules: !tournamentState.tournament_info.rules?.trim(),
      tournament_club_name: !tournamentState.tournament_info.tournament_club_name?.trim(),
      tournament_location: !tournamentState.tournament_info.tournament_location?.trim(),
      tournament_address: !tournamentState.tournament_info.tournament_address?.trim(),
      signup_limit_date: !tournamentState.tournament_info.signup_limit_date?.trim(),
      description: !tournamentState.tournament_info.description?.trim(),
      inscription_cost: !tournamentState.tournament_info.inscription_cost,
      first_place_prize: !tournamentState.tournament_info.first_place_prize?.trim(),
      selectedCourts: selectedCourts.length === 0,
      time_slots: tournamentState.time_slots.length === 0
    }

    setErrors(newErrors)

    if (!Object.values(newErrors).some(Boolean)) {
      handleSubmit(e)
    } else {
      toast({
        title: "Error",
        description: "Por favor, complete todos los campos requeridos",
        variant: "destructive",
      })
    }
  }

  // Primero, asegúrate de que tournament.time_slots esté inicializado
  const timeSlots = tournamentState.time_slots || [];

  return (
    <form onSubmit={validateForm} className="p-6">
      <div className="space-y-8">
        {/* Sección de Canchas */}
        <div className={cn(
          "bg-blue-50/50 p-6 rounded-lg border shadow-sm",
          errors.selectedCourts ? "border-red-300" : "border-blue-100"
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
                  errors.selectedCourts ? "border-red-500 hover:bg-red-50/50" : "border-blue-200 hover:bg-blue-50/50"
                )}
              >
                {selectedCourts?.length && selectedCourts.length > 0
                  ? `${selectedCourts.length} canchas seleccionadas`
                  : "Seleccionar canchas"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command className="border-none">
                <CommandGroup>
                  <div 
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-blue-50"
                    onClick={handleSelectAllCourts}
                  >
                    <Checkbox
                      checked={selectedCourts?.length === courts.length}
                      className="border-blue-400 data-[state=checked]:bg-blue-600"
                    />
                    <span className="text-xs font-medium">Seleccionar todas</span>
                  </div>
                  <div className="py-2">
                    {courts.map((court) => (
                      <div
                        key={court.id}
                        className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-blue-50"
                        onClick={() => handleCourtToggle(court.id)}
                      >
                        <Checkbox
                          checked={selectedCourts?.includes(court.id)}
                          className="border-blue-400 data-[state=checked]:bg-blue-600"
                        />
                        <span className="text-xs">{court.name}</span>
                      </div>
                    ))}
                  </div>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          {errors.selectedCourts && (
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
            timeSlots={timeSlots}
            onChange={(slots) => {
              setTournamentState((prevTournament) => ({
                ...prevTournament,
                tournament_info: prevTournament.tournament_info,
                time_slots: slots,
                start_date: prevTournament.start_date,
                end_date: prevTournament.end_date
              }));
            }}
            startDate={tournamentState.start_date}
            endDate={tournamentState.end_date}
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
                value={tournamentState.tournament_info.inscription_cost}
                onChange={(e) => setTournamentState({ 
                  ...tournamentState, 
                  tournament_info: { ...tournamentState.tournament_info, inscription_cost: Number(e.target.value) }
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
                      !tournamentState.tournament_info.signup_limit_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {tournamentState.tournament_info.signup_limit_date ? (
                      format(new Date(tournamentState.tournament_info.signup_limit_date + 'T12:00:00'), "PPP", { locale: es })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={tournamentState.tournament_info.signup_limit_date ? new Date(tournamentState.tournament_info.signup_limit_date + 'T12:00:00') : undefined}
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
                value={tournamentState.tournament_info.first_place_prize}
                onChange={(e) => setTournamentState({ 
                  ...tournamentState, 
                  tournament_info: { ...tournamentState.tournament_info, first_place_prize: e.target.value }
                })}
                placeholder="Premio"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="second_place_prize">Premio para segundo lugar</Label>
              <Input
                id="second_place_prize"
                value={tournamentState.tournament_info.second_place_prize}
                onChange={(e) => setTournamentState({ 
                  ...tournamentState, 
                  tournament_info: { ...tournamentState.tournament_info, second_place_prize: e.target.value }
                })}
                placeholder="Premio"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="third_place_prize">Premio para tercer lugar</Label>
              <Input
                id="third_place_prize"
                value={tournamentState.tournament_info.third_place_prize}
                onChange={(e) => setTournamentState({ 
                  ...tournamentState, 
                  tournament_info: { ...tournamentState.tournament_info, third_place_prize: e.target.value }
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
              value={tournamentState.tournament_info.description}
              onChange={(e) => setTournamentState({ ...tournamentState, tournament_info: { ...tournamentState.tournament_info, description: e.target.value } })}
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
              value={tournamentState.tournament_info.rules}
              onChange={(e) => setTournamentState({ ...tournamentState, tournament_info: { ...tournamentState.tournament_info, rules: e.target.value } })}
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
                value={tournamentState.tournament_info.tournament_club_name}
                onChange={(e) => setTournamentState({ ...tournamentState, tournament_info: { ...tournamentState.tournament_info, tournament_club_name: e.target.value } })}
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
                value={tournamentState.tournament_info.tournament_location}
                onChange={(e) => setTournamentState({ ...tournamentState, tournament_info: { ...tournamentState.tournament_info, tournament_location: e.target.value } })}
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
              value={tournamentState.tournament_info.tournament_address}
              onChange={(e) => setTournamentState({ ...tournamentState, tournament_info: { ...tournamentState.tournament_info, tournament_address: e.target.value }   })}
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