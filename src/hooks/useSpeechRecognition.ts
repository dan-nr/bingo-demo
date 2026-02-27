import { useState, useEffect, useCallback, useRef } from 'react';
import type { SpeechRecognitionState } from '../types';

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

const SpeechRecognitionCtor =
  (window as unknown as Record<string, unknown>).SpeechRecognition ??
  (window as unknown as Record<string, unknown>).webkitSpeechRecognition;

export function useSpeechRecognition() {
  const [state, setState] = useState<SpeechRecognitionState>({
    isSupported: !!SpeechRecognitionCtor,
    isListening: false,
    transcript: '',
    interimTranscript: '',
    error: null,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const onResultCallback = useRef<((transcript: string) => void) | null>(null);
  const shouldListenRef = useRef(false);

  useEffect(() => {
    if (!SpeechRecognitionCtor) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new (SpeechRecognitionCtor as any)();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      setState(prev => ({
        ...prev,
        transcript: prev.transcript + final,
        interimTranscript: interim,
      }));

      if (final && onResultCallback.current) {
        onResultCallback.current(final);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setState(prev => ({
        ...prev,
        error: event.error,
        isListening: false,
      }));
    };

    recognition.onend = () => {
      if (shouldListenRef.current) {
        try {
          recognition.start();
        } catch {
          // Already running
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const startListening = useCallback((onResult?: (transcript: string) => void) => {
    if (!recognitionRef.current) return;

    onResultCallback.current = onResult ?? null;
    shouldListenRef.current = true;

    setState(prev => ({
      ...prev,
      isListening: true,
      transcript: '',
      interimTranscript: '',
      error: null,
    }));

    try {
      recognitionRef.current.start();
    } catch {
      // Already running
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;

    shouldListenRef.current = false;

    setState(prev => ({
      ...prev,
      isListening: false,
    }));

    recognitionRef.current.stop();
    onResultCallback.current = null;
  }, []);

  const resetTranscript = useCallback(() => {
    setState(prev => ({
      ...prev,
      transcript: '',
      interimTranscript: '',
    }));
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
    resetTranscript,
  };
}
