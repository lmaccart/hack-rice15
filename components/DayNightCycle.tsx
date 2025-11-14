'use client';

import { useEffect, useState } from 'react';

type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';

interface DayNightCycleProps {
  cycleDuration?: number; // Duration of full cycle in ms (default: 10 minutes)
  showTimeIndicator?: boolean;
}

export default function DayNightCycle({
  cycleDuration = 600000, // 10 minutes default
  showTimeIndicator = true,
}: DayNightCycleProps) {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const quarterDuration = cycleDuration / 4;
    let startTime = Date.now();
    let currentPhase = 0;

    const updateCycle = () => {
      const elapsed = Date.now() - startTime;
      const phaseProgress = (elapsed % quarterDuration) / quarterDuration;
      const phase = Math.floor(elapsed / quarterDuration) % 4;

      if (phase !== currentPhase) {
        currentPhase = phase;
        const phases: TimeOfDay[] = ['morning', 'day', 'evening', 'night'];
        setTimeOfDay(phases[phase]);
      }

      setProgress(phaseProgress);
    };

    const interval = setInterval(updateCycle, 100);
    updateCycle();

    return () => clearInterval(interval);
  }, [cycleDuration]);

  const getOverlayStyles = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      pointerEvents: 'none',
      transition: 'background-color 3s ease-in-out, opacity 3s ease-in-out',
    };

    switch (timeOfDay) {
      case 'morning':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(255, 200, 150, 0.15)',
          opacity: 1 - progress * 0.5,
        };
      case 'day':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(255, 255, 200, 0.05)',
          opacity: 0.5,
        };
      case 'evening':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(255, 100, 50, 0.25)',
          opacity: 0.5 + progress * 0.5,
        };
      case 'night':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(0, 0, 50, 0.5)',
          opacity: 1,
        };
    }
  };

  const getTimeEmoji = () => {
    switch (timeOfDay) {
      case 'morning':
        return '🌅';
      case 'day':
        return '☀️';
      case 'evening':
        return '🌆';
      case 'night':
        return '🌙';
    }
  };

  const getTimeLabel = () => {
    switch (timeOfDay) {
      case 'morning':
        return 'Morning';
      case 'day':
        return 'Day';
      case 'evening':
        return 'Evening';
      case 'night':
        return 'Night';
    }
  };

  return (
    <>
      {/* Overlay effect */}
      <div
        className="fixed inset-0 z-10"
        style={getOverlayStyles()}
      />

      {/* Ambient stars for night time */}
      {timeOfDay === 'night' && (
        <div className="fixed inset-0 z-10 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 60}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: Math.random() * 0.7 + 0.3,
              }}
            />
          ))}
        </div>
      )}

      {/* Time indicator */}
      {showTimeIndicator && (
        <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50 bg-black bg-opacity-40 backdrop-blur-sm px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg border-2 border-white border-opacity-20">
          <div className="flex items-center gap-1 sm:gap-2 text-white">
            <span className="text-base sm:text-xl">{getTimeEmoji()}</span>
            <span className="text-xs sm:text-sm font-semibold">{getTimeLabel()}</span>
          </div>
          {/* Progress bar */}
          <div className="mt-1 w-full h-1 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-100"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
