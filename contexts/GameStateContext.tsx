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
  levelUpTrigger: number;
  achievementTrigger: number;
  coinsTrigger: number;
  xpTrigger: number;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export function GameStateProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(() => GameStorage.load());
  const [levelUpTrigger, setLevelUpTrigger] = useState(0);
  const [achievementTrigger, setAchievementTrigger] = useState(0);
  const [coinsTrigger, setCoinsTrigger] = useState(0);
  const [xpTrigger, setXpTrigger] = useState(0);

  // Save to localStorage whenever state changes
  useEffect(() => {
    GameStorage.save(gameState);
  }, [gameState]);

  const markBuildingVisited = useCallback((buildingName: string) => {
    setGameState((prev) => {
      const oldAchievements = prev.achievements.filter(a => a.unlocked).length;
      const oldLevel = prev.profile.level;

      let newState = GameStorage.markBuildingVisited(prev, buildingName);
      newState = GameStorage.checkAchievements(newState);
      newState = GameStorage.updateLevel(newState);

      // Trigger effects
      if (newState.achievements.filter(a => a.unlocked).length > oldAchievements) {
        setAchievementTrigger(Date.now());
      }
      if (newState.profile.level > oldLevel) {
        setLevelUpTrigger(Date.now());
      }

      return newState;
    });
  }, []);

  const completeQuiz = useCallback((buildingName: string, score: number, maxScore: number) => {
    setGameState((prev) => {
      const oldAchievements = prev.achievements.filter(a => a.unlocked).length;
      const oldLevel = prev.profile.level;

      let newState = GameStorage.completeQuiz(prev, buildingName, score, maxScore);
      newState = GameStorage.checkAchievements(newState);
      newState = GameStorage.updateLevel(newState);

      // Trigger effects
      if (newState.achievements.filter(a => a.unlocked).length > oldAchievements) {
        setAchievementTrigger(Date.now());
      }
      if (newState.profile.level > oldLevel) {
        setLevelUpTrigger(Date.now());
      }

      return newState;
    });
  }, []);

  const addCoins = useCallback((amount: number) => {
    setGameState((prev) => {
      const oldAchievements = prev.achievements.filter(a => a.unlocked).length;

      const newState = { ...prev };
      newState.profile.coins += amount;
      const finalState = GameStorage.checkAchievements(newState);

      // Trigger effects
      setCoinsTrigger(Date.now());
      if (finalState.achievements.filter(a => a.unlocked).length > oldAchievements) {
        setAchievementTrigger(Date.now());
      }

      return finalState;
    });
  }, []);

  const addXP = useCallback((amount: number) => {
    setGameState((prev) => {
      const oldAchievements = prev.achievements.filter(a => a.unlocked).length;
      const oldLevel = prev.profile.level;

      const newState = { ...prev };
      newState.profile.xp += amount;
      const finalState = GameStorage.updateLevel(GameStorage.checkAchievements(newState));

      // Trigger effects
      setXpTrigger(Date.now());
      if (finalState.achievements.filter(a => a.unlocked).length > oldAchievements) {
        setAchievementTrigger(Date.now());
      }
      if (finalState.profile.level > oldLevel) {
        setLevelUpTrigger(Date.now());
      }

      return finalState;
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
        levelUpTrigger,
        achievementTrigger,
        coinsTrigger,
        xpTrigger,
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
