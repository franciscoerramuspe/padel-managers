'use client';

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Trophy, Swords } from "lucide-react";

interface MatchResultBracketModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: any;
  onSubmit: (matchId: string, result: any) => void;
}

interface SetScore {
  team1: number | null;
  team2: number | null;
  tiebreak?: {
    team1: number;
    team2: number;
  } | null;
}

export function MatchResultBracketModal({
  isOpen,
  onClose,
  match,
  onSubmit,
}: MatchResultBracketModalProps) {
  const [set1, setSet1] = useState<SetScore>({ team1: null, team2: null, tiebreak: null });
  const [set2, setSet2] = useState<SetScore>({ team1: null, team2: null, tiebreak: null });
  const [superTiebreak, setSuperTiebreak] = useState<{ team1: number; team2: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const showSet1Tiebreak = (set1.team1 === 5 && set1.team2 === 5) || 
                          (set1.team1 === 6 && set1.team2 === 6);
  const showSet2Tiebreak = (set2.team1 === 5 && set2.team2 === 5) || 
                          (set2.team1 === 6 && set2.team2 === 6);

  // Determinar el ganador de cada set incluyendo el tiebreak
  const getSetWinner = (set: SetScore) => {
    // Si hay tiebreak, el ganador se determina por el tiebreak
    if (set.tiebreak) {
      return set.tiebreak.team1 > set.tiebreak.team2 ? 1 : 2;
    }
    
    // Si no hay tiebreak, se aplican las reglas normales
    if (set.team1 && set.team2 && set.team1 > set.team2 && set.team1 >= 6 && (set.team1 - set.team2 >= 2)) return 1;
    if (set.team1 && set.team2 && set.team2 > set.team1 && set.team2 >= 6 && (set.team2 - set.team1 >= 2)) return 2;
    return 0;
  };

  const set1Winner = getSetWinner(set1);
  const set2Winner = getSetWinner(set2);
  
  const showSuperTiebreak = set1Winner && set2Winner && set1Winner !== set2Winner;

  const handleSubmit = () => {
    // Validaciones
    if (!set1Winner) {
      setError("El primer set debe tener un ganador");
      return;
    }
    if (!set2Winner) {
      setError("El segundo set debe tener un ganador");
      return;
    }
    if (showSuperTiebreak && (!superTiebreak || superTiebreak.team1 === superTiebreak.team2)) {
      setError("El super tiebreak debe tener un ganador");
      return;
    }

    const result = {
      set1,
      set2,
      superTiebreak: showSuperTiebreak ? superTiebreak : null
    };

    onSubmit(match.id, result);
    onClose();
  };

  const roundName = 
    match.round === 1 ? 'Cuartos de Final' :
    match.round === 2 ? 'Semifinal' : 'Final';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px] p-0">
        <DialogTitle className="sr-only">Actualizar Resultado</DialogTitle>
        
        {/* Contenido del modal */}
        <div className="flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-semibold">
                Actualizar Resultado - {roundName}
              </h2>
            </div>
          </div>

          {/* Equipos */}
          <div className="bg-blue-50/50 px-6 py-3 border-b">
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <p className="font-medium text-sm">
                  {match.team1?.player1?.first_name} / {match.team1?.player2?.first_name}
                </p>
                <span className="text-xs text-gray-500">Local</span>
              </div>
              <Swords className="h-4 w-4 text-blue-500 mx-2" />
              <div className="text-center flex-1">
                <p className="font-medium text-sm">
                  {match.team2?.player1?.first_name} / {match.team2?.player2?.first_name}
                </p>
                <span className="text-xs text-gray-500">Visitante</span>
              </div>
            </div>
          </div>

          {/* Sets */}
          <div className="p-6 space-y-4">
            {/* Primer Set */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 text-blue-600 w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium">
                  1
                </div>
                <h3 className="text-sm font-medium text-gray-700">Primer Set</h3>
              </div>
              
              <div className="grid grid-cols-5 gap-3 items-center">
                <div className="col-span-2">
                  <input
                    type="number"
                    min="0"
                    max="7"
                    value={set1.team1 ?? ''}
                    onChange={(e) => setSet1(prev => ({
                      ...prev,
                      team1: e.target.value === '' ? null : Math.min(7, parseInt(e.target.value) || 0)
                    }))}
                    className="w-full text-center p-1.5 text-sm border rounded-md"
                  />
                </div>
                <div className="text-center text-xs text-gray-400">vs</div>
                <div className="col-span-2">
                  <input
                    type="number"
                    min="0"
                    max="7"
                    value={set1.team2 ?? ''}
                    onChange={(e) => setSet1(prev => ({
                      ...prev,
                      team2: e.target.value === '' ? null : Math.min(7, parseInt(e.target.value) || 0)
                    }))}
                    className="w-full text-center p-1.5 text-sm border rounded-md"
                  />
                </div>
              </div>

              {showSet1Tiebreak && (
                <div className="pl-7">
                  <p className="text-xs text-gray-500 mb-2">Tie Break</p>
                  <div className="grid grid-cols-5 gap-3">
                    <div className="col-span-2">
                      <input
                        type="number"
                        min="0"
                        value={set1.tiebreak?.team1 || 0}
                        onChange={(e) => setSet1(prev => ({
                          ...prev,
                          tiebreak: {
                            team1: parseInt(e.target.value) || 0,
                            team2: prev.tiebreak?.team2 || 0
                          }
                        }))}
                        className="w-full text-center p-1.5 text-sm border rounded-md bg-gray-50"
                      />
                    </div>
                    <div className="text-center text-xs text-gray-400">-</div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        min="0"
                        value={set1.tiebreak?.team2 || 0}
                        onChange={(e) => setSet1(prev => ({
                          ...prev,
                          tiebreak: {
                            team1: prev.tiebreak?.team1 || 0,
                            team2: parseInt(e.target.value) || 0
                          }
                        }))}
                        className="w-full text-center p-1.5 text-sm border rounded-md bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Segundo Set */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 text-blue-600 w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium">
                  2
                </div>
                <h3 className="text-sm font-medium text-gray-700">Segundo Set</h3>
              </div>
              
              <div className="grid grid-cols-5 gap-3 items-center">
                <div className="col-span-2">
                  <input
                    type="number"
                    min="0"
                    max="7"
                    value={set2.team1 ?? ''}
                    onChange={(e) => setSet2(prev => ({
                      ...prev,
                      team1: e.target.value === '' ? null : Math.min(7, parseInt(e.target.value) || 0)
                    }))}
                    className="w-full text-center p-1.5 text-sm border rounded-md"
                  />
                </div>
                <div className="text-center text-xs text-gray-400">vs</div>
                <div className="col-span-2">
                  <input
                    type="number"
                    min="0"
                    max="7"
                    value={set2.team2 ?? ''}
                    onChange={(e) => setSet2(prev => ({
                      ...prev,
                      team2: e.target.value === '' ? null : Math.min(7, parseInt(e.target.value) || 0)
                    }))}
                    className="w-full text-center p-1.5 text-sm border rounded-md"
                  />
                </div>
              </div>

              {showSet2Tiebreak && (
                <div className="pl-7">
                  <p className="text-xs text-gray-500 mb-2">Tie Break</p>
                  <div className="grid grid-cols-5 gap-3">
                    <div className="col-span-2">
                      <input
                        type="number"
                        min="0"
                        value={set2.tiebreak?.team1 || 0}
                        onChange={(e) => setSet2(prev => ({
                          ...prev,
                          tiebreak: {
                            team1: parseInt(e.target.value) || 0,
                            team2: prev.tiebreak?.team2 || 0
                          }
                        }))}
                        className="w-full text-center p-1.5 text-sm border rounded-md bg-gray-50"
                      />
                    </div>
                    <div className="text-center text-xs text-gray-400">-</div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        min="0"
                        value={set2.tiebreak?.team2 || 0}
                        onChange={(e) => setSet2(prev => ({
                          ...prev,
                          tiebreak: {
                            team1: prev.tiebreak?.team1 || 0,
                            team2: parseInt(e.target.value) || 0
                          }
                        }))}
                        className="w-full text-center p-1.5 text-sm border rounded-md bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Super Tiebreak */}
            {showSuperTiebreak && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="bg-amber-100 text-amber-600 w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium">
                    3
                  </div>
                  <h3 className="text-sm font-medium text-gray-700">Super Tiebreak</h3>
                </div>
                
                <div className="grid grid-cols-5 gap-3">
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="0"
                      value={superTiebreak?.team1 || 0}
                      onChange={(e) => setSuperTiebreak({
                        team1: parseInt(e.target.value) || 0,
                        team2: superTiebreak?.team2 || 0
                      })}
                      className="w-full text-center p-1.5 text-sm border rounded-md bg-gray-50"
                    />
                  </div>
                  <div className="text-center text-xs text-gray-400">-</div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="0"
                      value={superTiebreak?.team2 || 0}
                      onChange={(e) => setSuperTiebreak({
                        team1: superTiebreak?.team1 || 0,
                        team2: parseInt(e.target.value) || 0
                      })}
                      className="w-full text-center p-1.5 text-sm border rounded-md bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Guardar Resultado
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 