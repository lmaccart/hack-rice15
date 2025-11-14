'use client';

import { useGameState } from '@/contexts/GameStateContext';

export default function UserStatsHUD() {
  const { gameState } = useGameState();
  const { profile, statistics } = gameState;

  const xpForNextLevel = Math.pow(profile.level, 2) * 100;
  const xpProgress = (profile.xp - Math.pow(profile.level - 1, 2) * 100) / (xpForNextLevel - Math.pow(profile.level - 1, 2) * 100) * 100;

  return (
    <div className="fixed top-2 left-2 sm:top-4 sm:left-4 z-40 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2 sm:p-4 min-w-[200px] sm:min-w-[250px] max-w-[280px]">
      <div className="space-y-2 sm:space-y-3">
        {/* User info */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm sm:text-lg text-gray-800 truncate pr-2">{profile.username}</h3>
          <span className="text-xs sm:text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded whitespace-nowrap">
            Lvl {profile.level}
          </span>
        </div>

        {/* XP Bar */}
        <div>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>XP</span>
            <span>{profile.xp} / {xpForNextLevel}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(xpProgress, 100)}%` }}
            />
          </div>
        </div>

        {/* Coins */}
        <div className="flex items-center justify-between bg-yellow-50 rounded p-2">
          <span className="text-yellow-800 font-semibold">💰 Coins</span>
          <span className="text-yellow-900 font-bold">{profile.coins}</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-xs">
          <div className="bg-gray-50 p-1.5 sm:p-2 rounded">
            <div className="text-gray-500 text-[10px] sm:text-xs">Buildings</div>
            <div className="font-bold text-gray-800 text-xs sm:text-sm">{statistics.buildingsVisited}/6</div>
          </div>
          <div className="bg-gray-50 p-1.5 sm:p-2 rounded">
            <div className="text-gray-500 text-[10px] sm:text-xs">Quizzes</div>
            <div className="font-bold text-gray-800 text-xs sm:text-sm">{statistics.quizzesCompleted}/6</div>
          </div>
          <div className="bg-gray-50 p-1.5 sm:p-2 rounded">
            <div className="text-gray-500 text-[10px] sm:text-xs">Streak</div>
            <div className="font-bold text-gray-800 text-xs sm:text-sm">{profile.loginStreak}🔥</div>
          </div>
          <div className="bg-gray-50 p-1.5 sm:p-2 rounded">
            <div className="text-gray-500 text-[10px] sm:text-xs">Perfect</div>
            <div className="font-bold text-gray-800 text-xs sm:text-sm">{statistics.perfectScores}💯</div>
          </div>
        </div>
      </div>
    </div>
  );
}
