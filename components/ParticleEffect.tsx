'use client';

import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
  emoji?: string;
}

interface ParticleEffectProps {
  trigger: number; // Change this value to trigger new particles
  type?: 'levelup' | 'achievement' | 'coins' | 'xp';
  x?: number; // Position (percentage of viewport)
  y?: number;
}

export default function ParticleEffect({ trigger, type = 'xp', x = 50, y = 50 }: ParticleEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  const getParticleConfig = () => {
    switch (type) {
      case 'levelup':
        return {
          count: 30,
          colors: ['#FFD700', '#FFA500', '#FF6347', '#FF1493'],
          emojis: ['⭐', '✨', '🌟', '💫'],
          speed: 8,
          spread: 360,
        };
      case 'achievement':
        return {
          count: 25,
          colors: ['#9333EA', '#7C3AED', '#6366F1', '#3B82F6'],
          emojis: ['🏆', '🎖️', '🏅', '👑'],
          speed: 6,
          spread: 360,
        };
      case 'coins':
        return {
          count: 15,
          colors: ['#FFD700', '#FFC107', '#FFEB3B'],
          emojis: ['💰', '💵', '💎'],
          speed: 5,
          spread: 180,
        };
      case 'xp':
        return {
          count: 20,
          colors: ['#10B981', '#14B8A6', '#06B6D4', '#3B82F6'],
          emojis: ['⚡', '✨', '💥'],
          speed: 7,
          spread: 270,
        };
    }
  };

  useEffect(() => {
    if (trigger === 0) return;

    const config = getParticleConfig();
    const newParticles: Particle[] = [];

    for (let i = 0; i < config.count; i++) {
      const angle = (Math.random() * config.spread - config.spread / 2) * (Math.PI / 180);
      const speed = Math.random() * config.speed + 2;

      newParticles.push({
        id: Date.now() + i,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2, // Slight upward bias
        life: 100,
        size: Math.random() * 20 + 15,
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        emoji: config.emojis[Math.floor(Math.random() * config.emojis.length)],
      });
    }

    setParticles(newParticles);

    // Animate particles
    const interval = setInterval(() => {
      setParticles((prev) => {
        const updated = prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx * 0.5,
            y: p.y + p.vy * 0.5,
            vy: p.vy + 0.3, // Gravity
            life: p.life - 2,
            size: p.size * 0.98, // Shrink over time
          }))
          .filter((p) => p.life > 0);

        if (updated.length === 0) {
          clearInterval(interval);
        }

        return updated;
      });
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [trigger, type, x, y]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute transition-opacity duration-300"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.life / 100,
            transform: `translate(-50%, -50%) scale(${particle.size / 30})`,
          }}
        >
          {particle.emoji ? (
            <span className="text-4xl drop-shadow-lg">{particle.emoji}</span>
          ) : (
            <div
              className="w-4 h-4 rounded-full"
              style={{
                backgroundColor: particle.color,
                boxShadow: `0 0 10px ${particle.color}`,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
