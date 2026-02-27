import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import type { GameState } from '../types';
import { generateShareText, copyToClipboard } from '../lib/shareUtils';
import { Button } from './ui/Button';
import { BingoCard } from './BingoCard';

interface Props {
  game: GameState;
  onPlayAgain: () => void;
  onHome: () => void;
}

export function WinScreen({ game, onPlayAgain, onHome }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
  }, []);

  const elapsed = (game.completedAt ?? 0) - (game.startedAt ?? 0);
  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);

  const handleShare = async () => {
    if (!game.card || !game.category) return;
    const text = generateShareText(game.card, game.category, game.winningLine, elapsed);
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-5xl font-bold text-green-600 mb-2 animate-bounce-in">BINGO!</h1>
      <p className="text-gray-600 mb-1">
        {game.winningWord && <>Winning word: <strong>{game.winningWord}</strong></>}
      </p>
      <p className="text-sm text-gray-500 mb-6">
        Time: {minutes}m {seconds}s &middot; {game.filledCount}/25 filled
      </p>

      {game.card && (
        <div className="w-full max-w-xs mb-6">
          <BingoCard
            card={game.card}
            winningLine={game.winningLine}
            onSquareClick={() => {}}
          />
        </div>
      )}

      <div className="flex flex-wrap gap-3 justify-center">
        <Button onClick={handleShare}>
          {copied ? 'Copied!' : 'Share Result'}
        </Button>
        <Button variant="secondary" onClick={onPlayAgain}>
          Play Again
        </Button>
        <Button variant="ghost" onClick={onHome}>
          Home
        </Button>
      </div>
    </div>
  );
}
