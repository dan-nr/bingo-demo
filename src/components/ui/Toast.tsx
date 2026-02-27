import { useEffect } from 'react';
import type { Toast as ToastType } from '../../types';

const styles: Record<ToastType['type'], string> = {
  success: 'bg-green-100 text-green-800 border-green-300',
  info: 'bg-blue-100 text-blue-800 border-blue-300',
  warning: 'bg-amber-100 text-amber-800 border-amber-300',
};

interface Props {
  toast: ToastType;
  onDismiss: (id: string) => void;
}

export function Toast({ toast, onDismiss }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration ?? 3000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  return (
    <div className={`px-4 py-2 rounded-lg border text-sm font-medium animate-bounce-in ${styles[toast.type]}`}>
      {toast.message}
    </div>
  );
}
