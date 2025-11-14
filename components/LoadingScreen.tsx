'use client';

import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  isLoading: boolean;
}

const financialTips = [
  "💡 Tip: Pay yourself first by saving at least 10% of your income!",
  "💡 Tip: The 50/30/20 rule: 50% needs, 30% wants, 20% savings.",
  "💡 Tip: Always pay your credit card in full to avoid interest charges.",
  "💡 Tip: Start building credit early - your future self will thank you!",
  "💡 Tip: Emergency funds should cover 3-6 months of expenses.",
  "💡 Tip: Compound interest is your friend - start investing early!",
  "💡 Tip: Never share your PIN or passwords with anyone.",
  "💡 Tip: Check your credit report for free at AnnualCreditReport.com",
  "💡 Tip: Avoid payday loans - they trap you in a cycle of debt.",
  "💡 Tip: Create a budget and track your spending regularly.",
  "💡 Tip: A credit score above 700 gets you better loan rates.",
  "💡 Tip: Beware of 'too good to be true' investment offers.",
  "💡 Tip: Set up automatic savings transfers to build wealth effortlessly.",
  "💡 Tip: Don't max out your credit cards - keep usage below 30%.",
  "💡 Tip: Read the fine print before signing any financial agreement.",
];

export default function LoadingScreen({ isLoading }: LoadingScreenProps) {
  const [currentTip, setCurrentTip] = useState(0);
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setFadeOut(true);
      return;
    }

    // Rotate tips every 3 seconds
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % financialTips.length);
    }, 3000);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        // Slow down as we approach 100%
        const increment = prev < 30 ? 15 : prev < 60 ? 8 : prev < 90 ? 3 : 1;
        return Math.min(prev + increment, 100);
      });
    }, 200);

    return () => {
      clearInterval(tipInterval);
      clearInterval(progressInterval);
    };
  }, [isLoading]);

  if (!isLoading && fadeOut) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-gradient-to-b from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center px-8 max-w-2xl">
        {/* Title */}
        <h1 className="text-4xl md:text-6xl text-white mb-8 animate-pulse">
          Financial Literacy Quest
        </h1>

        {/* Pixel art coin animation */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-25"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full flex items-center justify-center text-4xl border-4 border-yellow-200 shadow-lg">
              💰
            </div>
          </div>
        </div>

        {/* Loading bar */}
        <div className="mb-8">
          <div className="bg-gray-800 rounded-full h-6 overflow-hidden border-4 border-gray-700">
            <div
              className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 h-full transition-all duration-300 flex items-center justify-end pr-2"
              style={{ width: `${progress}%` }}
            >
              {progress > 10 && (
                <span className="text-white text-xs font-bold drop-shadow-lg">
                  {Math.round(progress)}%
                </span>
              )}
            </div>
          </div>
          <p className="text-white text-sm mt-2 opacity-75">
            {progress < 100 ? 'Loading your financial adventure...' : 'Ready!'}
          </p>
        </div>

        {/* Financial literacy tip */}
        <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-lg p-6 border-2 border-white border-opacity-20 min-h-[100px] flex items-center justify-center">
          <p
            key={currentTip}
            className="text-white text-sm md:text-base leading-relaxed animate-fade-in"
          >
            {financialTips[currentTip]}
          </p>
        </div>

        {/* Keyboard hint */}
        <div className="mt-8 text-white text-xs opacity-50">
          <p>Use Arrow Keys or WASD to move • Click buildings to explore</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
