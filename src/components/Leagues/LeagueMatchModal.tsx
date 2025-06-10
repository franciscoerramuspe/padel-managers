import { useState } from 'react';
import { Trophy, Swords } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LeagueMatch } from '@/types/league';

interface SetScore {
  team1: number | null;
  team2: number | null;
  tiebreak: { team1: number; team2: number } | null;
}

interface LeagueMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: LeagueMatch;
  onSubmit: (matchId: string, result: any) => void;
  isLoading?: boolean;
}

export function LeagueMatchModal({
  isOpen,
  onClose,
  match,
  onSubmit,
  isLoading = false,
}: LeagueMatchModalProps) {
  const [set1, setSet1] = useState<SetScore>({ team1: null, team2: null, tiebreak: null });
  const [set2, setSet2] = useState<SetScore>({ team1: null, team2: null, tiebreak: null });
  const [superTiebreak, setSuperTiebreak] = useState<{ team1: number; team2: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const showSet1Tiebreak = (set1.team1 === 5 && set1.team2 === 5) || 
                          (set1.team1 === 6 && set1.team2 === 6);
  const showSet2Tiebreak = (set2.team1 === 5 && set2.team2 === 5) || 
                          (set2.team1 === 6 && set2.team2 === 6);

  const getSetWinner = (set: SetScore) => {
    if (set.tiebreak) {
      return set.tiebreak.team1 > set.tiebreak.team2 ? 1 : 2;
    }
    
    if (set.team1 && set.team2 && set.team1 > set.team2 && set.team1 >= 6 && (set.team1 - set.team2 >= 2)) return 1;
    if (set.team1 && set.team2 && set.team2 > set.team1 && set.team2 >= 6 && (set.team2 - set.team1 >= 2)) return 2;
    return 0;
  };

  const set1Winner = getSetWinner(set1);
  const set2Winner = getSetWinner(set2);
  
  const showSuperTiebreak = set1Winner && set2Winner && set1Winner !== set2Winner;

  const handleSubmit = () => {
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
      score: {
        set1,
        set2,
        superTiebreak: showSuperTiebreak ? superTiebreak : null
      },
      winner_id: set1Winner === set2Winner ? 
        (set1Winner === 1 ? match.league_team1_id : match.league_team2_id) :
        (superTiebreak!.team1 > superTiebreak!.team2 ? match.league_team1_id : match.league_team2_id)
    };

    onSubmit(match.id, result);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Actualizar Resultado</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Primer Set */}
          <div className="space-y-3">
            <h3 className="font-medium">Primer Set</h3>
            <div className="grid grid-cols-5 gap-3 items-center">
              <div className="col-span-2">
                <Input
                  type="number"
                  min="0"
                  max="7"
                  value={set1.team1 ?? ''}
                  onChange={(e) => setSet1(prev => ({
                    ...prev,
                    team1: e.target.value === '' ? null : Math.min(7, parseInt(e.target.value))
                  }))}
                  placeholder={match.team1}
                  disabled={isLoading}
                />
              </div>
              <div className="text-center text-sm text-gray-500">vs</div>
              <div className="col-span-2">
                <Input
                  type="number"
                  min="0"
                  max="7"
                  value={set1.team2 ?? ''}
                  onChange={(e) => setSet1(prev => ({
                    ...prev,
                    team2: e.target.value === '' ? null : Math.min(7, parseInt(e.target.value))
                  }))}
                  placeholder={match.team2}
                  disabled={isLoading}
                />
              </div>
            </div>

            {showSet1Tiebreak && (
              <div className="space-y-2">
                <h4 className="text-sm text-gray-500">Tie Break</h4>
                <div className="grid grid-cols-5 gap-3">
                  <div className="col-span-2">
                    <Input
                      type="number"
                      min="0"
                      value={set1.tiebreak?.team1 ?? ''}
                      onChange={(e) => setSet1(prev => ({
                        ...prev,
                        tiebreak: {
                          team1: parseInt(e.target.value) || 0,
                          team2: prev.tiebreak?.team2 || 0
                        }
                      }))}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="text-center text-sm text-gray-500">-</div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      min="0"
                      value={set1.tiebreak?.team2 ?? ''}
                      onChange={(e) => setSet1(prev => ({
                        ...prev,
                        tiebreak: {
                          team1: prev.tiebreak?.team1 || 0,
                          team2: parseInt(e.target.value) || 0
                        }
                      }))}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Segundo Set */}
          <div className="space-y-3">
            <h3 className="font-medium">Segundo Set</h3>
            <div className="grid grid-cols-5 gap-3 items-center">
              <div className="col-span-2">
                <Input
                  type="number"
                  min="0"
                  max="7"
                  value={set2.team1 ?? ''}
                  onChange={(e) => setSet2(prev => ({
                    ...prev,
                    team1: e.target.value === '' ? null : Math.min(7, parseInt(e.target.value))
                  }))}
                  placeholder={match.team1}
                  disabled={isLoading}
                />
              </div>
              <div className="text-center text-sm text-gray-500">vs</div>
              <div className="col-span-2">
                <Input
                  type="number"
                  min="0"
                  max="7"
                  value={set2.team2 ?? ''}
                  onChange={(e) => setSet2(prev => ({
                    ...prev,
                    team2: e.target.value === '' ? null : Math.min(7, parseInt(e.target.value))
                  }))}
                  placeholder={match.team2}
                  disabled={isLoading}
                />
              </div>
            </div>

            {showSet2Tiebreak && (
              <div className="space-y-2">
                <h4 className="text-sm text-gray-500">Tie Break</h4>
                <div className="grid grid-cols-5 gap-3">
                  <div className="col-span-2">
                    <Input
                      type="number"
                      min="0"
                      value={set2.tiebreak?.team1 ?? ''}
                      onChange={(e) => setSet2(prev => ({
                        ...prev,
                        tiebreak: {
                          team1: parseInt(e.target.value) || 0,
                          team2: prev.tiebreak?.team2 || 0
                        }
                      }))}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="text-center text-sm text-gray-500">-</div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      min="0"
                      value={set2.tiebreak?.team2 ?? ''}
                      onChange={(e) => setSet2(prev => ({
                        ...prev,
                        tiebreak: {
                          team1: prev.tiebreak?.team1 || 0,
                          team2: parseInt(e.target.value) || 0
                        }
                      }))}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Super Tiebreak */}
          {showSuperTiebreak && (
            <div className="space-y-3">
              <h3 className="font-medium">Super Tiebreak</h3>
              <div className="grid grid-cols-5 gap-3">
                <div className="col-span-2">
                  <Input
                    type="number"
                    min="0"
                    value={superTiebreak?.team1 ?? ''}
                    onChange={(e) => setSuperTiebreak(prev => ({
                      team1: parseInt(e.target.value) || 0,
                      team2: prev?.team2 || 0
                    }))}
                    disabled={isLoading}
                  />
                </div>
                <div className="text-center text-sm text-gray-500">-</div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    min="0"
                    value={superTiebreak?.team2 ?? ''}
                    onChange={(e) => setSuperTiebreak(prev => ({
                      team1: prev?.team1 || 0,
                      team2: parseInt(e.target.value) || 0
                    }))}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar Resultado"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
