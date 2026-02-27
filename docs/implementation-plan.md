# Meeting Bingo — Implementation Plan

## Context

The `/workspaces/bingo-demo/` project has three complete design documents (PRD, architecture, UX research) but zero code. This plan covers building the full MVP: a browser-based bingo game with live audio transcription that detects buzzwords during meetings. The target is a functional React + TypeScript app using Vite, Tailwind CSS, and the Web Speech API — all free, no backend.

## Phase 1: Project Scaffolding (Foundation)

1. Initialize Vite + React + TypeScript project in `/workspaces/bingo-demo/`
   - `npm create vite@latest . -- --template react-ts`
   - Install dependencies: `canvas-confetti`, `tailwindcss`, `postcss`, `autoprefixer`
2. Configure Tailwind CSS (`tailwind.config.js`, `postcss.config.js`, `src/index.css`)
   - Add custom animations: `pulse-fast`, `bounce-in`, `confetti`
3. Update `vite.config.ts` (port 3000, sourcemaps)
4. Create directory structure: `src/components/`, `src/components/ui/`, `src/hooks/`, `src/lib/`, `src/data/`, `src/types/`, `src/context/`

## Phase 2: Types & Data

5. Create `src/types/index.ts` — all TypeScript interfaces (`BingoSquare`, `BingoCard`, `GameState`, `WinningLine`, `Category`, `SpeechRecognitionState`, `Toast`)
6. Create `src/data/categories.ts` — three buzzword packs (Agile, Corporate, Tech) with 40+ words each

## Phase 3: Core Logic (Library Layer)

7. Create `src/lib/cardGenerator.ts` — Fisher-Yates shuffle, 5x5 grid generation, free space at center
8. Create `src/lib/bingoChecker.ts` — check rows, columns, diagonals; count filled; closest-to-win helper
9. Create `src/lib/wordDetector.ts` — text normalization, word boundary matching, multi-word phrase detection, alias support
10. Create `src/lib/shareUtils.ts` — generate shareable text/emoji grid, clipboard copy

## Phase 4: Hooks

11. Create `src/hooks/useSpeechRecognition.ts` — Web Speech API wrapper (continuous, interim results, auto-restart)
12. Create `src/hooks/useGame.ts` — game state management, square toggling, auto-fill wiring
13. Create `src/hooks/useBingoDetection.ts` — win condition monitoring
14. Create `src/hooks/useLocalStorage.ts` — persistence helper

## Phase 5: UI Components

15. Create UI primitives: `src/components/ui/Button.tsx`, `Card.tsx`, `Toast.tsx`
16. Create `src/components/LandingPage.tsx` — welcome screen with start button
17. Create `src/components/CategorySelect.tsx` — category picker (3 options with icons)
18. Create `src/components/BingoCard.tsx` — 5x5 grid container
19. Create `src/components/BingoSquare.tsx` — individual square with fill/auto-fill/winning states
20. Create `src/components/GameBoard.tsx` — main game view (card + controls + transcript)
21. Create `src/components/GameControls.tsx` — listen toggle, new card, back buttons
22. Create `src/components/TranscriptPanel.tsx` — live transcript with detected word badges
23. Create `src/components/WinScreen.tsx` — victory celebration with confetti, stats, share button

## Phase 6: App Assembly

24. Create `src/context/GameContext.tsx` — global game state provider
25. Update `src/App.tsx` — screen routing (landing → category → game → win)
26. Update `src/main.tsx` — mount with context provider

## Phase 7: Polish & Verify

27. Add `public/favicon.svg`
28. Update the project `README.md`
29. Run `npm run build` to verify no errors
30. Run `npm run dev` and manually test the full flow

## Verification

- `npm run dev` — app loads at localhost:3000
- `npm run build` — builds without errors
- `npm run typecheck` — no TypeScript errors
- Manual test: select category → card renders with 24 words + free space → tap squares → BINGO triggers on 5-in-a-row → confetti + win screen → share button copies result

## Key Files (30 total new files)

| Layer | Files |
|-------|-------|
| Config | `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`, `index.html` |
| Types | `src/types/index.ts` |
| Data | `src/data/categories.ts` |
| Logic | `src/lib/cardGenerator.ts`, `bingoChecker.ts`, `wordDetector.ts`, `shareUtils.ts` |
| Hooks | `src/hooks/useSpeechRecognition.ts`, `useGame.ts`, `useBingoDetection.ts`, `useLocalStorage.ts` |
| Components | 9 components + 3 UI primitives |
| App | `src/App.tsx`, `src/main.tsx`, `src/index.css`, `src/context/GameContext.tsx` |
