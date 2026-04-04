"use client";

import React, { createContext, useContext, useRef, useCallback } from "react";

interface AudioContextType {
  currentAudioRef: React.MutableRefObject<HTMLAudioElement | null>;
  registerAudioPlay: (audioRef: React.RefObject<HTMLAudioElement | null>) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const registerAudioPlay = useCallback(
    (audioRef: React.RefObject<HTMLAudioElement | null>) => {
      // Pause all other audios
      if (
        currentAudioRef.current &&
        currentAudioRef.current !== audioRef.current
      ) {
        currentAudioRef.current.pause();
      }
      // Set the new audio as current
      currentAudioRef.current = audioRef.current;
    },
    [],
  );

  return (
    <AudioContext.Provider value={{ currentAudioRef, registerAudioPlay }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudioContext() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudioContext must be used within AudioProvider");
  }
  return context;
}
