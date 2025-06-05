'use client';

import { Dialog } from '@headlessui/react';
import { X, Trophy, AlertCircle, Info, CheckCircle2, Swords } from 'lucide-react';
import { useMatchResult } from '@/hooks/useMatchResult';
import { needsSetTiebreak } from '@/utils/matchUtils';

interface MatchResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: {
    team1: { name: string };
    team2: { name: string };
  };
  onSubmit: (result: {
    set1: { team1: number; team2: number; tiebreak?: { team1: number; team2: number } };
    set2: { team1: number; team2: number; tiebreak?: { team1: number; team2: number } };
    superTiebreak?: { team1: number; team2: number };
  }) => void;
}

export function MatchResultModal({ isOpen, onClose, match, onSubmit }: MatchResultModalProps) {
  const {
    set1,
    set2,
    set1Tiebreak,
    set2Tiebreak,
    superTiebreak,
    error,
    setSet1,
    setSet2,
    setSet1Tiebreak,
    setSet2Tiebreak,
    setSuperTiebreak,
    needsSuperTiebreak,
    handleSubmit
  } = useMatchResult(onSubmit, onClose);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-md rounded-xl bg-white dark:bg-gray-800 shadow-xl">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                  Actualizar Resultado
                </Dialog.Title>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Ingresa el resultado del partido</p>
          </div>

          <div className="max-h-[calc(100vh-16rem)] overflow-y-auto p-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">{match.team1.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Local</div>
                </div>
                <Swords className="h-5 w-5 text-blue-600 dark:text-blue-400 mx-4" />
                <div className="text-center flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">{match.team2.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Visitante</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h4 className="flex items-center gap-2 mb-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-500 text-white text-sm font-bold">
                    1
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">Primer Set</span>
                </h4>
                <div className="grid grid-cols-5 gap-3 items-center">
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="0"
                      max="7"
                      value={set1.team1}
                      onChange={(e) => setSet1(prev => ({ ...prev, team1: parseInt(e.target.value) }))}
                      className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-center"
                    />
                  </div>
                  <div className="text-center text-gray-400 dark:text-gray-500">vs</div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="0"
                      max="7"
                      value={set1.team2}
                      onChange={(e) => setSet1(prev => ({ ...prev, team2: parseInt(e.target.value) }))}
                      className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-center"
                    />
                  </div>
                </div>

                {needsSetTiebreak(set1) && (
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-orange-500 dark:text-orange-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tiebreak Set 1</span>
                    </div>
                    <div className="grid grid-cols-5 gap-3 items-center">
                      <div className="col-span-2">
                        <input
                          type="number"
                          min="0"
                          max="15"
                          value={set1Tiebreak?.team1 || 0}
                          onChange={(e) => setSet1Tiebreak(prev => ({ 
                            team1: parseInt(e.target.value),
                            team2: prev?.team2 || 0
                          }))}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-center"
                        />
                      </div>
                      <span className="text-gray-500 dark:text-gray-400">vs</span>
                      <div className="col-span-2">
                        <input
                          type="number"
                          min="0"
                          max="15"
                          value={set1Tiebreak?.team2 || 0}
                          onChange={(e) => setSet1Tiebreak(prev => ({ 
                            team1: prev?.team1 || 0,
                            team2: parseInt(e.target.value)
                          }))}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-center"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h4 className="flex items-center gap-2 mb-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-500 text-white text-sm font-bold">
                    2
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">Segundo Set</span>
                </h4>
                <div className="grid grid-cols-5 gap-3 items-center">
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="0"
                      max="7"
                      value={set2.team1}
                      onChange={(e) => setSet2(prev => ({ ...prev, team1: parseInt(e.target.value) }))}
                      className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-center"
                    />
                  </div>
                  <div className="text-center text-gray-400 dark:text-gray-500">vs</div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="0"
                      max="7"
                      value={set2.team2}
                      onChange={(e) => setSet2(prev => ({ ...prev, team2: parseInt(e.target.value) }))}
                      className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-center"
                    />
                  </div>
                </div>

                {needsSetTiebreak(set2) && (
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-orange-500 dark:text-orange-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tiebreak Set 2</span>
                    </div>
                    <div className="grid grid-cols-5 gap-3 items-center">
                      <div className="col-span-2">
                        <input
                          type="number"
                          min="0"
                          max="15"
                          value={set2Tiebreak?.team1 || 0}
                          onChange={(e) => setSet2Tiebreak(prev => ({ 
                            team1: parseInt(e.target.value),
                            team2: prev?.team2 || 0
                          }))}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-center"
                        />
                      </div>
                      <span className="text-gray-500 dark:text-gray-400">vs</span>
                      <div className="col-span-2">
                        <input
                          type="number"
                          min="0"
                          max="15"
                          value={set2Tiebreak?.team2 || 0}
                          onChange={(e) => setSet2Tiebreak(prev => ({ 
                            team1: prev?.team1 || 0,
                            team2: parseInt(e.target.value)
                          }))}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-center"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {needsSuperTiebreak() && (
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-2 mb-3">
                    <Trophy className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <h4 className="font-medium text-orange-900 dark:text-orange-200">Super Tiebreak</h4>
                  </div>
                  <div className="grid grid-cols-5 gap-3 items-center">
                    <div className="col-span-2">
                      <input
                        type="number"
                        min="0"
                        max="15"
                        value={superTiebreak?.team1 || 0}
                        onChange={(e) => setSuperTiebreak(prev => ({ 
                          team1: parseInt(e.target.value),
                          team2: prev?.team2 || 0
                        }))}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-center"
                      />
                    </div>
                    <span className="text-gray-500 dark:text-gray-400">vs</span>
                    <div className="col-span-2">
                      <input
                        type="number"
                        min="0"
                        max="15"
                        value={superTiebreak?.team2 || 0}
                        onChange={(e) => setSuperTiebreak(prev => ({ 
                          team1: prev?.team1 || 0,
                          team2: parseInt(e.target.value)
                        }))}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-center"
                      />
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-lg flex items-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                Guardar Resultado
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 