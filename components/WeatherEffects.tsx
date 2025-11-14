'use client';

import { useEffect, useState } from 'react';

type WeatherType = 'clear' | 'rain' | 'snow';

interface Particle {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  opacity: number;
  drift?: number; // For snow
}

interface WeatherEffectsProps {
  weatherDuration?: number; // How long each weather state lasts (ms)
  enableRandomWeather?: boolean;
  fixedWeather?: WeatherType;
}

export default function WeatherEffects({
  weatherDuration = 300000, // 5 minutes default
  enableRandomWeather = true,
  fixedWeather,
}: WeatherEffectsProps) {
  const [weather, setWeather] = useState<WeatherType>(fixedWeather || 'clear');
  const [particles, setParticles] = useState<Particle[]>([]);

  // Weather cycle management
  useEffect(() => {
    if (fixedWeather) {
      setWeather(fixedWeather);
      return;
    }

    if (!enableRandomWeather) return;

    const weatherTypes: WeatherType[] = ['clear', 'clear', 'clear', 'rain', 'snow']; // More clear weather
    let currentIndex = 0;

    const changeWeather = () => {
      currentIndex = (currentIndex + 1) % weatherTypes.length;
      setWeather(weatherTypes[currentIndex]);
    };

    const interval = setInterval(changeWeather, weatherDuration);

    return () => clearInterval(interval);
  }, [weatherDuration, enableRandomWeather, fixedWeather]);

  // Particle generation and animation
  useEffect(() => {
    if (weather === 'clear') {
      setParticles([]);
      return;
    }

    const particleCount = weather === 'rain' ? 100 : 80;
    const initialParticles: Particle[] = [];

    // Generate initial particles
    for (let i = 0; i < particleCount; i++) {
      initialParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        speed: weather === 'rain' ? Math.random() * 2 + 3 : Math.random() * 0.5 + 0.5,
        size: weather === 'rain' ? Math.random() * 2 + 1 : Math.random() * 3 + 2,
        opacity: weather === 'rain' ? Math.random() * 0.3 + 0.4 : Math.random() * 0.4 + 0.6,
        drift: weather === 'snow' ? Math.random() * 0.5 - 0.25 : 0,
      });
    }

    setParticles(initialParticles);

    // Animate particles
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => {
          let newY = p.y + p.speed * 0.3;
          let newX = p.x + (p.drift || 0) * 0.3;

          // Reset when particle goes off screen
          if (newY > 100) {
            newY = -2;
            newX = Math.random() * 100;
          }

          // Keep x in bounds
          if (newX < 0) newX = 100;
          if (newX > 100) newX = 0;

          return {
            ...p,
            y: newY,
            x: newX,
          };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [weather]);

  if (weather === 'clear') return null;

  return (
    <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute ${
            weather === 'rain' ? 'bg-blue-200' : 'bg-white rounded-full'
          }`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: weather === 'rain' ? `${particle.size * 8}px` : `${particle.size}px`,
            opacity: particle.opacity,
            transform: weather === 'rain' ? 'rotate(10deg)' : 'none',
          }}
        />
      ))}

      {/* Weather indicator */}
      <div className="fixed top-[68px] right-2 sm:top-20 sm:right-4 z-50 bg-black bg-opacity-40 backdrop-blur-sm px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg border-2 border-white border-opacity-20">
        <div className="flex items-center gap-1 sm:gap-2 text-white text-xs sm:text-sm">
          <span className="text-base sm:text-lg">{weather === 'rain' ? '🌧️' : '❄️'}</span>
          <span className="font-semibold capitalize">{weather}</span>
        </div>
      </div>
    </div>
  );
}
