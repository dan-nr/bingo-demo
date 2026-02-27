import type { BingoCard, CategoryId, WinningLine } from '../types';

export function generateShareText(
  card: BingoCard,
  category: CategoryId,
  winningLine: WinningLine | null,
  elapsedMs: number,
): string {
  const winningSquareIds = new Set(winningLine?.squares ?? []);
  const minutes = Math.floor(elapsedMs / 60000);

  const grid = card.squares
    .map(row =>
      row.map(sq => {
        if (sq.isFreeSpace) return '⭐';
        if (winningSquareIds.has(sq.id)) return '🟩';
        if (sq.isFilled) return '🟦';
        return '⬜';
      }).join('')
    )
    .join('\n');

  return `Meeting Bingo - ${category} 🎉\n${grid}\nBINGO in ${minutes} min!`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
