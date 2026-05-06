'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { GameState } from '@/types/userProgress';
import { GameStorage } from '@/lib/gameStorage';

interface GameStateContextType {
  gameState: GameState;
  markBuildingVisited: (buildingName: string) => void;
  completeQuiz: (buildingName: string, score: number, maxScore: number) => void;
  addCoins: (amount: number) => void;
  addXP: (amount: number) => void;
  saveState: () => void;
  resetProgress: () => void;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export function GameStateProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(() => GameStorage.load());

  // Save to localStorage whenever state changes
  useEffect(() => {
    GameStorage.save(gameState);
  }, [gameState]);

  const markBuildingVisited = useCallback((buildingName: string) => {
    setGameState((prev) => {
      let newState = GameStorage.markBuildingVisited(prev, buildingName);
      newState = GameStorage.checkAchievements(newState);
      newState = GameStorage.updateLevel(newState);
      return newState;
    });
  }, []);

  const completeQuiz = useCallback((buildingName: string, score: number, maxScore: number) => {
    setGameState((prev) => {
      let newState = GameStorage.completeQuiz(prev, buildingName, score, maxScore);
      newState = GameStorage.checkAchievements(newState);
      newState = GameStorage.updateLevel(newState);
      return newState;
    });
  }, []);

  const addCoins = useCallback((amount: number) => {
    setGameState((prev) => {
      const newState = { ...prev };
      newState.profile.coins += amount;
      return GameStorage.checkAchievements(newState);
    });
  }, []);

  const addXP = useCallback((amount: number) => {
    setGameState((prev) => {
      const newState = { ...prev };
      newState.profile.xp += amount;
      return GameStorage.updateLevel(GameStorage.checkAchievements(newState));
    });
  }, []);

  const saveState = useCallback(() => {
    GameStorage.save(gameState);
  }, [gameState]);

  const resetProgress = useCallback(() => {
    GameStorage.clear();
    setGameState(GameStorage.load());
  }, []);

  return (
    <GameStateContext.Provider
      value={{
        gameState,
        markBuildingVisited,
        completeQuiz,
        addCoins,
        addXP,
        saveState,
        resetProgress,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
}
