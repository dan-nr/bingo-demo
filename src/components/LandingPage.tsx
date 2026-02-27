import { Button } from './ui/Button';

interface Props {
  onStart: () => void;
}

export function LandingPage({ onStart }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-5xl font-bold text-gray-900 mb-4">Meeting Bingo</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        Turn your next meeting into a game. Listen for buzzwords and race to BINGO!
      </p>
      <Button onClick={onStart} className="text-lg px-8 py-3">
        Play Now
      </Button>
      <p className="mt-6 text-xs text-gray-400">
        Audio is processed locally and never recorded.
      </p>
    </div>
  );
}
