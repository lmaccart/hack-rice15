'use client';

import { GameStateProvider } from '@/contexts/GameStateContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GameStateProvider>
      {children}
    </GameStateProvider>
  );
}
