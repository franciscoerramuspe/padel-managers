import { useState } from 'react';
import { isValidSetScore, needsSetTiebreak, getSetWinner } from '../utils/matchUtils';

export const useMatchResult = (onSubmit: Function, onClose: () => void) => {
  const [set1, setSet1] = useState({ team1: 0, team2: 0 });
  const [set2, setSet2] = useState({ team1: 0, team2: 0 });
  const [set1Tiebreak, setSet1Tiebreak] = useState<{ team1: number; team2: number } | null>(null);
  const [set2Tiebreak, setSet2Tiebreak] = useState<{ team1: number; team2: number } | null>(null);
  const [superTiebreak, setSuperTiebreak] = useState<{ team1: number; team2: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const needsSuperTiebreak = () => {
    const set1Winner = getSetWinner(set1, set1Tiebreak);
    const set2Winner = getSetWinner(set2, set2Tiebreak);

    if (set1Winner === 0 || set2Winner === 0) return false;
    return set1Winner !== set2Winner;
  };

  const handleSubmit = () => {
    if (!isValidSetScore(set1)) {
      setError('El resultado del primer set no es válido');
      return;
    }
    if (!isValidSetScore(set2)) {
      setError('El resultado del segundo set no es válido');
      return;
    }
    if (needsSetTiebreak(set1) && (!set1Tiebreak || set1Tiebreak.team1 === set1Tiebreak.team2)) {
      setError('Debe ingresar un resultado válido para el tiebreak del primer set');
      return;
    }
    if (needsSetTiebreak(set2) && (!set2Tiebreak || set2Tiebreak.team1 === set2Tiebreak.team2)) {
      setError('Debe ingresar un resultado válido para el tiebreak del segundo set');
      return;
    }
    if (needsSuperTiebreak() && (!superTiebreak || superTiebreak.team1 === superTiebreak.team2)) {
      setError('Debe ingresar un resultado válido para el super tiebreak');
      return;
    }

    onSubmit({
      set1: {
        ...set1,
        ...(needsSetTiebreak(set1) && set1Tiebreak ? { tiebreak: set1Tiebreak } : {})
      },
      set2: {
        ...set2,
        ...(needsSetTiebreak(set2) && set2Tiebreak ? { tiebreak: set2Tiebreak } : {})
      },
      ...(needsSuperTiebreak() && superTiebreak ? { superTiebreak } : {})
    });
    onClose();
  };

  return {
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
    needsSetTiebreak,
    needsSuperTiebreak,
    handleSubmit
  };
};