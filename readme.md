# Meeting Bingo

A browser-based bingo game with live audio transcription. Listen for buzzwords during meetings and race to BINGO!

## Features

- **3 buzzword categories**: Agile & Scrum, Corporate Speak, Tech & Engineering
- **Live speech recognition**: Web Speech API detects buzzwords automatically
- **Manual tap fallback**: Tap squares if speech misses a word
- **Win detection**: Rows, columns, and diagonals
- **Confetti celebration**: Victory animation with shareable results
- **Fully local**: No backend, no audio recording, no data leaves your browser

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Web Speech API
- canvas-confetti

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in Chrome for best speech recognition support.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run typecheck` | TypeScript type checking |
| `npm run lint` | ESLint |

## Browser Support

| Browser | Speech Recognition |
|---------|--------------------|
| Chrome 33+ | Full support |
| Edge 79+ | Full support |
| Safari 14.1+ | Full support (webkit prefix) |
| Firefox | Limited (behind flag) |
| Mobile Chrome/Safari | Full support |

Speech recognition is optional — the game works with manual taps in any browser.
