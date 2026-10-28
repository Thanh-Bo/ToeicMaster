// app/providers.tsx
'use client';

import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AudioProvider } from "./contexts/AudioContext";
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AudioProvider>
          <Toaster position="top-center" />
          {children}
        </AudioProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}