import type { GameState, UserProfile } from '@/types/userProgress';

const STORAGE_KEY = 'financial_literacy_quest_data';

// Default user profile
const createDefaultProfile = (): UserProfile => ({
  username: 'Player',
  level: 1,
  xp: 0,
  coins: 0,
  totalScore: 0,
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
  loginStreak: 1,
});

// Default game state
const createDefaultGameState = (): GameState => ({
  profile: createDefaultProfile(),
  buildings: {
    credituniversity: { visited: false, completed: false, quizScore: 0 },
    bank: { visited: false, completed: false, quizScore: 0 },
    townhall: { visited: false, completed: false, quizScore: 0 },
    shop: { visited: false, completed: false, quizScore: 0 },
    bistro: { visited: false, completed: false, quizScore: 0 },
    policestation: { visited: false, completed: false, quizScore: 0 },
  },
  achievements: [
    { id: 'first_visit', name: 'First Steps', description: 'Visit your first building', icon: '🏠', unlocked: false },
    { id: 'all_visited', name: 'Explorer', description: 'Visit all buildings', icon: '🗺️', unlocked: false },
    { id: 'first_quiz', name: 'Quiz Master', description: 'Complete your first quiz', icon: '📝', unlocked: false },
    { id: 'perfect_score', name: 'Perfect!', description: 'Get 100% on a quiz', icon: '💯', unlocked: false },
    { id: 'week_streak', name: 'Dedicated Learner', description: 'Login for 7 days in a row', icon: '🔥', unlocked: false },
    { id: 'rich', name: 'Coin Collector', description: 'Earn 1000 coins', icon: '💰', unlocked: false },
    { id: 'level_10', name: 'Financial Guru', description: 'Reach level 10', icon: '⭐', unlocked: false },
  ],
  goals: [],
  customization: {
    characterSkin: 'default',
    unlockedSkins: ['default'],
  },
  statistics: {
    totalPlayTime: 0,
    buildingsVisited: 0,
    quizzesCompleted: 0,
    perfectScores: 0,
  },
});

export const GameStorage = {
  // Load game state from localStorage
  load: (): GameState => {
    if (typeof window === 'undefined') return createDefaultGameState();

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return createDefaultGameState();

      const data = JSON.parse(saved);

      // Update login streak
      const lastLogin = new Date(data.profile.lastLogin);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === 1) {
        data.profile.loginStreak += 1;
      } else if (daysDiff > 1) {
        data.profile.loginStreak = 1;
      }

      data.profile.lastLogin = now.toISOString();

      return data;
    } catch (error) {
      console.error('Error loading game state:', error);
      return createDefaultGameState();
    }
  },

  // Save game state to localStorage
  save: (state: GameState): void => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving game state:', error);
    }
  },

  // Clear all data
  clear: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  },

  // Mark a building as visited
  markBuildingVisited: (state: GameState, buildingName: string): GameState => {
    const newState = { ...state };
    if (!newState.buildings[buildingName].visited) {
      newState.buildings[buildingName].visited = true;
      newState.buildings[buildingName].lastVisited = new Date().toISOString();
      newState.statistics.buildingsVisited += 1;
      newState.profile.xp += 10;
      newState.profile.coins += 5;
    }
    return newState;
  },

  // Complete a quiz
  completeQuiz: (state: GameState, buildingName: string, score: number, maxScore: number): GameState => {
    const newState = { ...state };
    const wasCompleted = newState.buildings[buildingName].completed;

    newState.buildings[buildingName].completed = true;
    newState.buildings[buildingName].quizScore = Math.max(
      newState.buildings[buildingName].quizScore,
      score
    );

    const percentage = (score / maxScore) * 100;
    const xpGained = Math.floor(percentage * 2); // Up to 200 XP for perfect score
    const coinsGained = Math.floor(percentage / 10); // Up to 10 coins

    newState.profile.xp += xpGained;
    newState.profile.coins += coinsGained;
    newState.profile.totalScore += score;

    if (!wasCompleted) {
      newState.statistics.quizzesCompleted += 1;
    }

    if (percentage === 100) {
      newState.statistics.perfectScores += 1;
    }

    return newState;
  },

  // Unlock achievement
  unlockAchievement: (state: GameState, achievementId: string): GameState => {
    const newState = { ...state };
    const achievement = newState.achievements.find(a => a.id === achievementId);

    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true;
      achievement.unlockedAt = new Date().toISOString();
      newState.profile.xp += 50;
      newState.profile.coins += 20;
    }

    return newState;
  },

  // Check and unlock achievements based on current state
  checkAchievements: (state: GameState): GameState => {
    let newState = { ...state };

    // First visit
    if (newState.statistics.buildingsVisited >= 1) {
      newState = GameStorage.unlockAchievement(newState, 'first_visit');
    }

    // All visited
    const allVisited = Object.values(newState.buildings).every(b => b.visited);
    if (allVisited) {
      newState = GameStorage.unlockAchievement(newState, 'all_visited');
    }

    // First quiz
    if (newState.statistics.quizzesCompleted >= 1) {
      newState = GameStorage.unlockAchievement(newState, 'first_quiz');
    }

    // Perfect score
    if (newState.statistics.perfectScores >= 1) {
      newState = GameStorage.unlockAchievement(newState, 'perfect_score');
    }

    // Week streak
    if (newState.profile.loginStreak >= 7) {
      newState = GameStorage.unlockAchievement(newState, 'week_streak');
    }

    // Rich
    if (newState.profile.coins >= 1000) {
      newState = GameStorage.unlockAchievement(newState, 'rich');
    }

    // Level 10
    if (newState.profile.level >= 10) {
      newState = GameStorage.unlockAchievement(newState, 'level_10');
    }

    return newState;
  },

  // Calculate level from XP
  calculateLevel: (xp: number): number => {
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  },

  // Update level based on XP
  updateLevel: (state: GameState): GameState => {
    const newState = { ...state };
    newState.profile.level = GameStorage.calculateLevel(newState.profile.xp);
    return newState;
  },
};
