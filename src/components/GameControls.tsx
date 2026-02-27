import { Button } from './ui/Button';

interface Props {
  isListening: boolean;
  isSupported: boolean;
  onToggleListen: () => void;
  onNewCard: () => void;
  onBack: () => void;
}

export function GameControls({
  isListening,
  isSupported,
  onToggleListen,
  onNewCard,
  onBack,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
      {isSupported && (
        <Button
          variant={isListening ? 'secondary' : 'primary'}
          onClick={onToggleListen}
        >
          {isListening ? 'Pause Listening' : 'Start Listening'}
        </Button>
      )}
      <Button variant="secondary" onClick={onNewCard}>
        New Card
      </Button>
      <Button variant="ghost" onClick={onBack}>
        Quit
      </Button>
    </div>
  );
}
