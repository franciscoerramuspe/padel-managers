import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TournamentFormData } from "@/types/tournament"
import { useCourts } from "@/hooks/useCourts"
import { Command, CommandGroup } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronsUpDown } from "lucide-react"
import { useState, useEffect } from "react"
import { MapPin, Trophy, Info, Clock, ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { format, startOfDay } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { es } from "date-fns/locale"
import { TimeSlots } from "@/components/Tournaments/create/TimeSlots"
import { toast } from "@/components/ui/use-toast"
import { TimeSlot } from "@/types/tournament"


interface TournamentDetailInfoProps {
  tournament: TournamentFormData;
  setTournament: (tournament: TournamentFormData) => void;
  onSubmit: (tournamentData: TournamentFormData) => Promise<void>;
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
    inscription_cost: false,
    first_place_prize: false,
    selectedCourts: false,
    time_slots: false
  })

  const [tournamentState, setTournamentState] = useState(tournament);

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

  const handleInputChange = (field: string, value: any) => {
    setTournamentState(prev => ({
      ...prev,
      tournament_info: {
        ...prev.tournament_info,
        [field]: value
      }
    }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const signupDate = new Date(date);
      const tournamentStart = new Date(tournamentState.start_date);
      
      if (signupDate >= tournamentStart) {
        toast({
          title: "Error",
          description: "La fecha límite de inscripción debe ser anterior a la fecha de inicio del torneo",
          variant: "destructive",
        });
        return;
      }

      handleInputChange('signup_limit_date', format(date, 'yyyy-MM-dd'));
    }
  };

  const handleTimeSlotChange = (slots: TimeSlot[]) => {
    const updatedTournament = {
      ...tournamentState,
      time_slots: slots
    };
    setTournamentState(updatedTournament);
    setTournament(updatedTournament);
  };

  const validateForm = () => {
    const newErrors = {
      rules: !tournamentState.tournament_info.rules?.trim(),
      tournament_club_name: !tournamentState.tournament_info.tournament_club_name?.trim(),
      tournament_location: !tournamentState.tournament_info.tournament_location?.trim(),
      tournament_address: !tournamentState.tournament_info.tournament_address?.trim(),
      signup_limit_date: !tournamentState.tournament_info.signup_limit_date?.trim(),
      inscription_cost: !tournamentState.tournament_info.inscription_cost,
      first_place_prize: !tournamentState.tournament_info.first_place_prize?.trim(),
      selectedCourts: selectedCourts.length === 0,
      time_slots: tournamentState.time_slots.length === 0
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Error",
        description: "Por favor, complete todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    console.log('Estado del torneo antes de enviar:', tournamentState);
    
    try {
      await onSubmit({
        ...tournamentState,
        tournament_info: {
          ...tournamentState.tournament_info,
          inscription_cost: Number(tournamentState.tournament_info.inscription_cost)
        }
      });
    } catch (error) {
      console.error('Error submitting tournament:', error);
      toast({
        title: "Error",
        description: "Hubo un error al crear el torneo",
        variant: "destructive",
      });
    }
  };

  // Cada vez que el estado local cambia, actualizamos el estado del padre
  useEffect(() => {
    setTournament(tournamentState);
  }, [tournamentState, setTournament]);

  // Primero, asegúrate de que tournament.time_slots esté inicializado
  const timeSlots = tournamentState.time_slots || [];

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="space-y-8">
        {/* Sección de Canchas */}
        <div className={cn(
          "bg-blue-50/50 dark:bg-blue-900/20 p-6 rounded-lg border shadow-sm",
          errors.selectedCourts ? "border-red-300 dark:border-red-700" : "border-blue-100 dark:border-blue-800"
        )}>
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-800/50 rounded-full">
              <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300">Canchas Disponibles</h3>
              <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
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
                  "w-full justify-between mt-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
                  errors.selectedCourts ? "border-red-500 dark:border-red-700 hover:bg-red-50/50 dark:hover:bg-red-900/20" : "border-blue-200 dark:border-blue-800 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                )}
              >
                {selectedCourts?.length && selectedCourts.length > 0
                  ? `${selectedCourts.length} canchas seleccionadas`
                  : "Seleccionar canchas"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" align="start">
              <Command className="border-none">
                <CommandGroup>
                  <div 
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    onClick={handleSelectAllCourts}
                  >
                    <Checkbox
                      checked={selectedCourts?.length === courts.length}
                      className="border-blue-400 dark:border-blue-500 data-[state=checked]:bg-blue-600 dark:data-[state=checked]:bg-blue-500"
                    />
                    <span className="text-xs font-medium dark:text-gray-300">Seleccionar todas</span>
                  </div>
                  <div className="py-2">
                    {courts.map((court) => (
                      <div
                        key={court.id}
                        className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        onClick={() => handleCourtToggle(court.id)}
                      >
                        <Checkbox
                          checked={selectedCourts?.includes(court.id)}
                          className="border-blue-400 dark:border-blue-500 data-[state=checked]:bg-blue-600 dark:data-[state=checked]:bg-blue-500"
                        />
                        <span className="text-xs dark:text-gray-300">{court.name}</span>
                      </div>
                    ))}
                  </div>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          {errors.selectedCourts && (
            <p className="text-sm text-red-500 dark:text-red-400 mt-2">
              Debe seleccionar al menos una cancha
            </p>
          )}
        </div>

        {/* Sección de Time Slots */}
        <div className={cn(
          "bg-blue-50/50 dark:bg-blue-900/20 p-6 rounded-lg border shadow-sm",
          errors.time_slots ? "border-red-300 dark:border-red-700" : "border-blue-100 dark:border-blue-800"
        )}>
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-800/50 rounded-full">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300">Horarios del Torneo</h3>
              <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                Configura los horarios para cada día del torneo (viernes a domingo). Puedes asignar un horario diferente para cada día.
              </p>
            </div>
          </div>

          <TimeSlots
            timeSlots={timeSlots as TimeSlot[]}
            onChange={handleTimeSlotChange}
            startDate={tournamentState.start_date}
            endDate={tournamentState.end_date}
          />
          {errors.time_slots && (
            <p className="text-sm text-red-500 dark:text-red-400 mt-2">
              Debe agregar al menos un horario disponible
            </p>
          )}
        </div>

        {/* Sección de Fechas y Costos */}
        <div className="bg-purple-50/50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-100 dark:border-purple-800 shadow-sm">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-800/50 rounded-full">
              <CalendarIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-300">Fechas y Costos</h3>
              <p className="text-sm text-purple-700 dark:text-purple-400 mt-1">
                Establece los costos de inscripción y las fechas límite para el torneo.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-purple-900 dark:text-purple-300 font-medium">
                Costo de Inscripción
              </Label>
              <Input
                type="number"
                value={tournamentState.tournament_info.inscription_cost}
                onChange={(e) => handleInputChange('inscription_cost', Number(e.target.value))}
                placeholder="0.00"
                className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-700 focus-visible:ring-purple-500 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-purple-900 dark:text-purple-300 font-medium">
                Fecha Límite de Inscripción
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-white dark:bg-gray-800",
                      errors.signup_limit_date ? "border-red-500 dark:border-red-700" : "border-purple-200 dark:border-purple-700 hover:bg-purple-50/50 dark:hover:bg-purple-900/20",
                      !tournamentState.tournament_info.signup_limit_date && "text-muted-foreground dark:text-gray-400"
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
                <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" align="start">
                  <Calendar
                    mode="single"
                    selected={tournamentState.tournament_info.signup_limit_date ? new Date(tournamentState.tournament_info.signup_limit_date) : undefined}
                    onSelect={handleDateSelect}
                    disabled={(date) => date < new Date()}
                    fromDate={new Date()}
                    toDate={new Date(tournamentState.start_date)}
                    initialFocus
                    locale={es}
                    className="dark:bg-gray-800"
                  />
                </PopoverContent>
              </Popover>
              {errors.signup_limit_date && (
                <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                  La fecha límite de inscripción es requerida
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sección de Premios */}
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-100 dark:border-green-800">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-800/50 rounded-full">
              <Trophy className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-300">Premios del Torneo</h3>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                Define los premios para los primeros lugares del torneo.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="first_place_prize" className="text-green-900 dark:text-green-300">Premio para primer lugar</Label>
              <Input
                id="first_place_prize"
                value={tournamentState.tournament_info.first_place_prize}
                onChange={(e) => handleInputChange('first_place_prize', e.target.value)}
                placeholder="Premio"
                className={cn(
                  "mt-2 bg-white dark:bg-gray-800 border-green-200 dark:border-green-700 dark:text-white",
                  errors.first_place_prize && "border-red-500 dark:border-red-700"
                )}
              />
              {errors.first_place_prize && (
                <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                  El premio para el primer lugar es requerido
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="second_place_prize" className="text-green-900 dark:text-green-300">Premio para segundo lugar</Label>
              <Input
                id="second_place_prize"
                value={tournamentState.tournament_info.second_place_prize}
                onChange={(e) => handleInputChange('second_place_prize', e.target.value)}
                placeholder="Premio"
                className="mt-2 bg-white dark:bg-gray-800 border-green-200 dark:border-green-700 dark:text-white"
              />
            </div>
            <div>
              <Label htmlFor="third_place_prize" className="text-green-900 dark:text-green-300">Premio para tercer lugar</Label>
              <Input
                id="third_place_prize"
                value={tournamentState.tournament_info.third_place_prize}
                onChange={(e) => handleInputChange('third_place_prize', e.target.value)}
                placeholder="Premio"
                className="mt-2 bg-white dark:bg-gray-800 border-green-200 dark:border-green-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Sección de Información General */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
              <Info className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">Información Adicional</h3>
              <p className="text-sm text-gray-700 dark:text-gray-400 mt-1">
                Completa la información general del torneo.
              </p>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">Descripción del Torneo</Label>
            <Textarea
              id="description"
              value={tournamentState.tournament_info.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Ingrese una descripción detallada del torneo"
              className="mt-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 dark:text-white"
              rows={4}
            />
          </div>

          {/* Reglas */}
          <div className="space-y-2 mt-4">
            <Label htmlFor="rules" className="text-gray-700 dark:text-gray-300">Reglas del Torneo</Label>
            <Textarea
              id="rules"
              value={tournamentState.tournament_info.rules}
              onChange={(e) => handleInputChange('rules', e.target.value)}
              placeholder="Ingrese las reglas del torneo"
              className={cn(
                "mt-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 dark:text-white",
                errors.rules && "border-red-500 dark:border-red-700 focus-visible:ring-red-500"
              )}
            />
            {errors.rules && (
              <p className="text-sm text-red-500 dark:text-red-400">
                Las reglas del torneo son requeridas
              </p>
            )}
          </div>

          {/* Ubicación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label htmlFor="tournament_club_name" className="text-gray-700 dark:text-gray-300">Club</Label>
              <Input
                id="tournament_club_name"
                value={tournamentState.tournament_info.tournament_club_name}
                onChange={(e) => handleInputChange('tournament_club_name', e.target.value)}
                placeholder="Nombre del club"
                className={cn(
                  "mt-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 dark:text-white",
                  errors.tournament_club_name && "border-red-500 dark:border-red-700 focus-visible:ring-red-500"
                )}
              />
              {errors.tournament_club_name && (
                <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                  El nombre del club es requerido
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="tournament_location" className="text-gray-700 dark:text-gray-300">Ubicación</Label>
              <Input
                id="tournament_location"
                value={tournamentState.tournament_info.tournament_location}
                onChange={(e) => handleInputChange('tournament_location', e.target.value)}
                placeholder="Departamento"
                className={cn(
                  "mt-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 dark:text-white",
                  errors.tournament_location && "border-red-500 dark:border-red-700 focus-visible:ring-red-500"
                )}
              />
              {errors.tournament_location && (
                <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                  La ubicación es requerida
                </p>
              )}
            </div>
          </div>

          {/* Dirección */}
          <div className="mt-4">
            <Label htmlFor="tournament_address" className="text-gray-700 dark:text-gray-300">Dirección</Label>
            <Input
              id="tournament_address"
              value={tournamentState.tournament_info.tournament_address}
              onChange={(e) => handleInputChange('tournament_address', e.target.value)}
              placeholder="Dirección completa"
              className={cn(
                "mt-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 dark:text-white",
                errors.tournament_address && "border-red-500 dark:border-red-700 focus-visible:ring-red-500"
              )}
            />
            {errors.tournament_address && (
              <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                La dirección es requerida
              </p>
            )}
          </div>
        </div>

        {/* Sección de botones */}
        <div className="flex justify-between mt-8 pt-6 border-t dark:border-gray-700">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onBack}
            className="border-gray-300 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <Button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Crear Torneo
          </Button>
        </div>
      </div>
    </form>
  )
} 