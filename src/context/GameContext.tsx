import { useGame } from '../hooks/useGame';
import { GameContext } from './gameContextValue';

export function GameProvider({ children }: { children: React.ReactNode }) {
  const gameValue = useGame();
  return <GameContext.Provider value={gameValue}>{children}</GameContext.Provider>;
}
