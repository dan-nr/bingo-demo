import { useEffect, useRef } from 'react';
import type { BingoCard, WinningLine } from '../types';
import { checkForBingo } from '../lib/bingoChecker';

export function useBingoDetection(
  card: BingoCard | null,
  onBingo: (line: WinningLine, lastWord: string) => void,
) {
  const prevFilledRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!card) return;

    const currentFilled = new Set(
      card.squares.flat().filter(sq => sq.isFilled).map(sq => sq.id),
    );

    // Find the newly filled square
    let lastFilledWord = '';
    for (const id of currentFilled) {
      if (!prevFilledRef.current.has(id)) {
        const sq = card.squares.flat().find(s => s.id === id);
        if (sq && !sq.isFreeSpace) lastFilledWord = sq.word;
      }
    }

    prevFilledRef.current = currentFilled;

    const winningLine = checkForBingo(card);
    if (winningLine) {
      onBingo(winningLine, lastFilledWord);
    }
  }, [card, onBingo]);
}
