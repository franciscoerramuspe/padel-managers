interface TournamentSidebarProps {
    tournament: any;
  }
  
  export function TournamentSidebar({ tournament }: TournamentSidebarProps) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Detalles</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Costo de Inscripción</p>
              <p className="font-medium">$</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Canchas Disponibles</p>
              <p className="font-medium">{tournament.courts_available}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }