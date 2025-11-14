'use client';

import { useEffect, useRef, useState } from 'react';

interface JoystickDirection {
  x: number; // -1 to 1
  y: number; // -1 to 1
}

interface VirtualJoystickProps {
  onDirectionChange: (direction: JoystickDirection) => void;
}

export default function VirtualJoystick({ onDirectionChange }: VirtualJoystickProps) {
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [basePosition, setBasePosition] = useState({ x: 0, y: 0 });
  const joystickRef = useRef<HTMLDivElement>(null);
  const maxDistance = 50; // Maximum distance the stick can move from center

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = joystickRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      setBasePosition({ x: centerX, y: centerY });
      setIsActive(true);
      handleTouchMove(e);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isActive && e.type === 'touchmove') return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - basePosition.x;
    const deltaY = touch.clientY - basePosition.y;

    // Calculate distance from center
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Limit the distance
    const limitedDistance = Math.min(distance, maxDistance);
    const angle = Math.atan2(deltaY, deltaX);

    const x = Math.cos(angle) * limitedDistance;
    const y = Math.sin(angle) * limitedDistance;

    setPosition({ x, y });

    // Normalize direction to -1 to 1
    const normalizedX = x / maxDistance;
    const normalizedY = y / maxDistance;

    onDirectionChange({ x: normalizedX, y: normalizedY });
  };

  const handleTouchEnd = () => {
    setIsActive(false);
    setPosition({ x: 0, y: 0 });
    onDirectionChange({ x: 0, y: 0 });
  };

  // Check if device is mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) return null;

  return (
    <div
      ref={joystickRef}
      className="fixed bottom-8 left-8 w-32 h-32 z-40 touch-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      {/* Base */}
      <div className="absolute inset-0 bg-gray-800/30 backdrop-blur-sm rounded-full border-4 border-gray-600/50 flex items-center justify-center">
        {/* Stick */}
        <div
          className={`absolute w-16 h-16 bg-blue-500/80 rounded-full border-4 border-blue-400 transition-all shadow-lg ${
            isActive ? 'scale-110' : 'scale-100'
          }`}
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            transition: isActive ? 'none' : 'transform 0.2s ease-out',
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Direction indicators */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 text-white/50 text-xs">▲</div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-white/50 text-xs">▼</div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 text-white/50 text-xs">◄</div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-white/50 text-xs">►</div>
      </div>
    </div>
  );
}
