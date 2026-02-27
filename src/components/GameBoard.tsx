import { useState, useCallback } from 'react';
import type { GameState, WinningLine } from '../types';
import { detectWordsWithAliases } from '../lib/wordDetector';
import { getClosestToWin } from '../lib/bingoChecker';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useBingoDetection } from '../hooks/useBingoDetection';
import { BingoCard } from './BingoCard';
import { TranscriptPanel } from './TranscriptPanel';
import { GameControls } from './GameControls';

interface Props {
  game: GameState;
  onToggleSquare: (squareId: string) => void;
  onAutoFill: (word: string) => void;
  onSetListening: (listening: boolean) => void;
  onWin: (line: WinningLine, word: string) => void;
  onNewCard: () => void;
  onBack: () => void;
}

export function GameBoard({
  game,
  onToggleSquare,
  onAutoFill,
  onSetListening,
  onWin,
  onNewCard,
  onBack,
}: Props) {
  const [detectedWords, setDetectedWords] = useState<string[]>([]);
  const speech = useSpeechRecognition();

  const handleTranscript = useCallback((transcript: string) => {
    if (!game.card) return;

    const alreadyFilled = new Set(
      game.card.squares.flat().filter(sq => sq.isFilled).map(sq => sq.word.toLowerCase()),
    );

    const words = detectWordsWithAliases(transcript, game.card.words, alreadyFilled);
    for (const word of words) {
      onAutoFill(word);
      setDetectedWords(prev => [...prev, word]);
    }
  }, [game.card, onAutoFill]);

  const handleToggleListen = useCallback(() => {
    if (speech.isListening) {
      speech.stopListening();
      onSetListening(false);
    } else {
      speech.startListening(handleTranscript);
      onSetListening(true);
    }
  }, [speech, handleTranscript, onSetListening]);

  useBingoDetection(game.card, onWin);

  const closest = game.card ? getClosestToWin(game.card) : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-6">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Meeting Bingo</h2>
          <span className="text-sm text-gray-500">
            {game.filledCount}/25 filled
          </span>
        </div>

        {closest && closest.needed === 1 && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm px-3 py-2 rounded-lg mb-3 text-center font-medium">
            One away on {closest.line}!
          </div>
        )}

        {game.card && (
          <BingoCard
            card={game.card}
            winningLine={game.winningLine}
            onSquareClick={onToggleSquare}
          />
        )}

        <GameControls
          isListening={speech.isListening}
          isSupported={speech.isSupported}
          onToggleListen={handleToggleListen}
          onNewCard={onNewCard}
          onBack={onBack}
        />

        {speech.isSupported && (
          <TranscriptPanel
            transcript={speech.transcript}
            interimTranscript={speech.interimTranscript}
            detectedWords={detectedWords}
            isListening={speech.isListening}
          />
        )}

        {!speech.isSupported && (
          <p className="text-sm text-gray-500 text-center mt-4">
            Speech recognition is not supported in this browser. You can still tap squares manually.
          </p>
        )}
      </div>
    </div>
  );
}
