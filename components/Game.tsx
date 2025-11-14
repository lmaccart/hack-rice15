'use client';

import { useEffect, useRef, useState } from 'react';
import * as Phaser from 'phaser';
import { MainScene } from '@/game/MainScene';
import { OverlayType } from '@/types/game';
import WizardChatbot from './WizardChatbot';
import UserStatsHUD from './UserStatsHUD';
import VirtualJoystick from './VirtualJoystick';
import ParticleEffect from './ParticleEffect';
import { useGameState } from '@/contexts/GameStateContext';

// Import overlays (we'll create these next)
import CreditUniversity from './overlays/CreditUniversity';
import BankOverlay from './overlays/BankOverlay';
import TownHall from './overlays/TownHall';
import ShopOverlay from './overlays/ShopOverlay';
import BistroOverlay from './overlays/BistroOverlay';
import PoliceStationOverlay from './overlays/PoliceStationOverlay';

export default function Game() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const [activeOverlay, setActiveOverlay] = useState<OverlayType>(null);
  const [currentHotspotName, setCurrentHotspotName] = useState<string | null>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const { markBuildingVisited, levelUpTrigger, achievementTrigger } = useGameState();
  const joystickDirectionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (gameRef.current) return; // Prevent double initialization

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: 'game-container',
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      scene: MainScene,
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    game.events.on('ready', () => {
      const mainScene = game.scene.getScene('MainScene') as MainScene;
      if (mainScene) {
        mainScene.setActiveOverlay = (overlay: string | null) => setActiveOverlay(overlay as OverlayType);
        mainScene.setCurrentHotspotName = setCurrentHotspotName;
        mainScene.setIsChatbotOpen = setIsChatbotOpen;
        mainScene.getJoystickDirection = () => joystickDirectionRef.current;
      }
    });

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  // Update scene state when React state changes
  useEffect(() => {
    if (gameRef.current) {
      const mainScene = gameRef.current.scene.getScene('MainScene') as MainScene;
      if (mainScene) {
        mainScene.activeOverlay = activeOverlay;
        mainScene.isChatbotOpen = isChatbotOpen;
      }
    }
  }, [activeOverlay, isChatbotOpen]);

  const handleInspectClick = () => {
    if (currentHotspotName) {
      markBuildingVisited(currentHotspotName);
      setActiveOverlay(currentHotspotName as OverlayType);
    }
  };

  const handleCloseOverlay = () => {
    setActiveOverlay(null);
    setCurrentHotspotName(null);
  };

  const handleJoystickDirection = (direction: { x: number; y: number }) => {
    joystickDirectionRef.current = direction;
  };

  const getHotspotDisplayName = (name: string) => {
    const displayNames: Record<string, string> = {
      credituniversity: 'Credit University',
      bank: 'Bank',
      townhall: 'Town Hall',
      shop: 'Shop',
      bistro: 'Bistro',
      policestation: 'Police Station',
    };
    return displayNames[name] || name;
  };

  return (
    <div className="relative w-full h-full">
      <div id="game-container" className="w-full h-full" />

      {/* User Stats HUD */}
      <UserStatsHUD />

      {/* Inspect button */}
      {currentHotspotName && !activeOverlay && (
        <button
          onClick={handleInspectClick}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-colors text-lg"
        >
          Inspect {getHotspotDisplayName(currentHotspotName)}
        </button>
      )}

      {/* Overlays */}
      {activeOverlay === 'credituniversity' && <CreditUniversity onClose={handleCloseOverlay} />}
      {activeOverlay === 'bank' && <BankOverlay onClose={handleCloseOverlay} />}
      {activeOverlay === 'townhall' && <TownHall onClose={handleCloseOverlay} />}
      {activeOverlay === 'shop' && <ShopOverlay onClose={handleCloseOverlay} />}
      {activeOverlay === 'bistro' && <BistroOverlay onClose={handleCloseOverlay} />}
      {activeOverlay === 'policestation' && <PoliceStationOverlay onClose={handleCloseOverlay} />}

      {/* Wizard Chatbot */}
      <WizardChatbot setIsChatbotOpen={setIsChatbotOpen} />

      {/* Virtual Joystick for mobile */}
      <VirtualJoystick onDirectionChange={handleJoystickDirection} />

      {/* Particle Effects */}
      <ParticleEffect trigger={levelUpTrigger} type="levelup" x={50} y={30} />
      <ParticleEffect trigger={achievementTrigger} type="achievement" x={50} y={30} />
    </div>
  );
}
