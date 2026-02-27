import { useState, useCallback } from 'react';
import type { GameState, CategoryId, BingoCard } from '../types';
import { generateCard } from '../lib/cardGenerator';
import { countFilled } from '../lib/bingoChecker';

const INITIAL_STATE: GameState = {
  status: 'idle',
  category: null,
  card: null,
  isListening: false,
  startedAt: null,
  completedAt: null,
  winningLine: null,
  winningWord: null,
  filledCount: 0,
};

export function useGame() {
  const [game, setGame] = useState<GameState>(INITIAL_STATE);

  const startGame = useCallback((categoryId: CategoryId) => {
    const card = generateCard(categoryId);
    setGame({
      status: 'playing',
      category: categoryId,
      card,
      isListening: false,
      startedAt: Date.now(),
      completedAt: null,
      winningLine: null,
      winningWord: null,
      filledCount: 1, // Free space
    });
  }, []);

  const toggleSquare = useCallback((squareId: string) => {
    setGame(prev => {
      if (!prev.card || prev.status !== 'playing') return prev;

      const newSquares = prev.card.squares.map(row =>
        row.map(sq => {
          if (sq.id !== squareId || sq.isFreeSpace) return sq;
          return {
            ...sq,
            isFilled: !sq.isFilled,
            isAutoFilled: false,
            filledAt: !sq.isFilled ? Date.now() : null,
          };
        }),
      );

      const newCard: BingoCard = { ...prev.card, squares: newSquares };
      return { ...prev, card: newCard, filledCount: countFilled(newCard) };
    });
  }, []);

  const autoFillWord = useCallback((word: string) => {
    setGame(prev => {
      if (!prev.card || prev.status !== 'playing') return prev;

      const normalizedWord = word.toLowerCase();
      const newSquares = prev.card.squares.map(row =>
        row.map(sq => {
          if (sq.isFilled || sq.isFreeSpace) return sq;
          if (sq.word.toLowerCase() !== normalizedWord) return sq;
          return {
            ...sq,
            isFilled: true,
            isAutoFilled: true,
            filledAt: Date.now(),
          };
        }),
      );

      const newCard: BingoCard = { ...prev.card, squares: newSquares };
      return { ...prev, card: newCard, filledCount: countFilled(newCard) };
    });
  }, []);

  const setListening = useCallback((isListening: boolean) => {
    setGame(prev => ({ ...prev, isListening }));
  }, []);

  const winGame = useCallback((winningLine: GameState['winningLine'], winningWord: string) => {
    setGame(prev => ({
      ...prev,
      status: 'won',
      completedAt: Date.now(),
      winningLine,
      winningWord,
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGame(INITIAL_STATE);
  }, []);

  return {
    game,
    startGame,
    toggleSquare,
    autoFillWord,
    setListening,
    winGame,
    resetGame,
  };
}
