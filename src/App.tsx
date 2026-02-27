import { useState, useCallback } from 'react';
import type { CategoryId, WinningLine } from './types';
import { useGameContext } from './hooks/useGameContext';
import { LandingPage } from './components/LandingPage';
import { CategorySelect } from './components/CategorySelect';
import { GameBoard } from './components/GameBoard';
import { WinScreen } from './components/WinScreen';

type Screen = 'landing' | 'category' | 'game' | 'win';

function AppContent() {
  const [screen, setScreen] = useState<Screen>('landing');
  const { game, startGame, toggleSquare, autoFillWord, setListening, winGame, resetGame } = useGameContext();

  const handleCategorySelect = useCallback((categoryId: CategoryId) => {
    startGame(categoryId);
    setScreen('game');
  }, [startGame]);

  const handleWin = useCallback((line: WinningLine, word: string) => {
    winGame(line, word);
    setScreen('win');
  }, [winGame]);

  const handleNewCard = useCallback(() => {
    if (game.category) {
      startGame(game.category);
    }
  }, [game.category, startGame]);

  const handleHome = useCallback(() => {
    resetGame();
    setScreen('landing');
  }, [resetGame]);

  return (
    <div className="min-h-screen bg-gray-50">
      {screen === 'landing' && (
        <LandingPage onStart={() => setScreen('category')} />
      )}
      {screen === 'category' && (
        <CategorySelect onSelect={handleCategorySelect} onBack={handleHome} />
      )}
      {screen === 'game' && game.card && (
        <GameBoard
          game={game}
          onToggleSquare={toggleSquare}
          onAutoFill={autoFillWord}
          onSetListening={setListening}
          onWin={handleWin}
          onNewCard={handleNewCard}
          onBack={handleHome}
        />
      )}
      {screen === 'win' && (
        <WinScreen game={game} onPlayAgain={() => setScreen('category')} onHome={handleHome} />
      )}
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
