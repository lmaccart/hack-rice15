// User progress and game state types

export interface BuildingProgress {
  visited: boolean;
  completed: boolean;
  quizScore: number;
  lastVisited?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserProfile {
  username: string;
  level: number;
  xp: number;
  coins: number;
  totalScore: number;
  createdAt: string;
  lastLogin: string;
  loginStreak: number;
}

export interface BuildingVisitRecord {
  [buildingName: string]: BuildingProgress;
}

export interface UserGoal {
  id: string;
  title: string;
  description: string;
  targetAmount?: number;
  currentAmount?: number;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface GameState {
  profile: UserProfile;
  buildings: BuildingVisitRecord;
  achievements: Achievement[];
  goals: UserGoal[];
  customization: {
    characterSkin: string;
    unlockedSkins: string[];
  };
  statistics: {
    totalPlayTime: number;
    buildingsVisited: number;
    quizzesCompleted: number;
    perfectScores: number;
  };
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  buildingName: string;
  questions: QuizQuestion[];
}

export interface SoundEffect {
  key: string;
  path: string;
  volume: number;
}

export interface MusicTrack {
  key: string;
  path: string;
  volume: number;
  loop: boolean;
}
