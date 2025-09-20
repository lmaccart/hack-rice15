import React, { useEffect, useState } from 'react';
import Phaser from 'phaser';
import './Game.css';
import BudgetingTool from './BudgetingTool';
import CreditUniversity from './CreditUniversity';
import CreditScoreCalculator from './CreditScoreCalculator';
import AlternativeCreditReporting from './AlternativeCreditReporting';

function Game() {
  const [showBudgetingTool, setShowBudgetingTool] = useState(false);
  const [showCreditUniversity, setShowCreditUniversity] = useState(false);
  const [showCreditScoreCalculator, setShowCreditScoreCalculator] = useState(false);
  const [showAlternativeCreditReporting, setShowAlternativeCreditReporting] = useState(false);

  // new state variables to track if player is in hotspot
  const [isPlayerInBudgetingHotspot, setIsPlayerInBudgetingHotspot] = useState(false);
  const [isPlayerInCreditUniversityHotspot, setIsPlayerInCreditUniversityHotspot] = useState(false);
  const [isPlayerInCreditScoreCalculatorHotspot, setIsPlayerInCreditScoreCalculatorHotspot] = useState(false);
  const [isPlayerInAlternativeCreditReportingHotspot, setIsPlayerInAlternativeCreditReportingHotspot] = useState(false);

  useEffect(() => {
    const config = {
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
          gravity: { y: 0 },
          debug: false,
        },
      },
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
    };

    const game = new Phaser.Game(config);

    function preload() {
      this.load.image('grass', 'img/bkgdArt/Grass.png');
      this.load.image('fence', 'img/bkgdArt/Fence.png');
      this.load.image('path', 'img/bkgdArt/Path.png');
      this.load.image('tree', 'img/bkgdArt/Tree.png');
      this.load.image('bank_front', 'img/storefronts/bank_front.png');
      this.load.image('creditu_front', 'img/storefronts/creditu.png');

      // Load character walk animations
      const directions = ['east', 'north', 'north-east', 'north-west', 'south', 'south-east', 'south-west', 'west'];
      directions.forEach(direction => {
        for (let i = 0; i < 6; i++) {
          this.load.image(`walk_${direction}_${i}`, `img/characterSprites/animations/walk/${direction}/frame_00${i}.png`);
        }
      });
    }

    function create() {
      // Create game objects
      this.add.image(400, 300, 'grass');
      this.add.image(400, 500, 'fence');
      this.add.image(400, 300, 'path');
      this.add.image(200, 150, 'tree');
      this.add.image(600, 150, 'tree');

      // Define hotspot regions
      const hotspots = [
        { x: 200, y: 200, width: 50, height: 50, name: 'budgeting' },
        { x: 600, y: 300, width: 64, height: 64, name: 'credituniversity' }, // assuming creditu_front is 64x64
        { x: 400, y: 100, width: 64, height: 64, name: 'creditscorecalculator' }, // assuming bank_front is 64x64
        { x: 700, y: 500, width: 50, height: 50, name: 'alternativecreditreporting' },
      ];

      // Calculate a safe spawn position
      const spawnPadding = 100;
      let safeSpawnX, safeSpawnY;
      let isSafe = false;

      while (!isSafe) {
        safeSpawnX = Phaser.Math.Between(spawnPadding, config.width - spawnPadding);
        safeSpawnY = Phaser.Math.Between(spawnPadding, config.height - spawnPadding);
        isSafe = true;
        for (const hotspot of hotspots) {
          const distance = Phaser.Math.Distance.Between(safeSpawnX, safeSpawnY, hotspot.x, hotspot.y);
          if (distance < (Math.max(hotspot.width, hotspot.height) / 2) + spawnPadding) {
            isSafe = false;
            break;
          }
        }
      }

      this.player = this.physics.add.sprite(safeSpawnX, safeSpawnY, 'walk_south_0');
      this.player.setCollideWorldBounds(true);

      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = {
        up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      };

      // Create animations
      const directions = ['east', 'north', 'north-east', 'north-west', 'south', 'south-east', 'south-west', 'west'];
      directions.forEach(direction => {
        this.anims.create({
          key: `walk_${direction}`,
          frames: Array.from({ length: 6 }, (_, i) => ({ key: `walk_${direction}_${i}` })),
          frameRate: 10,
          repeat: -1
        });
      });

      // Placeholder for interacting with budgeting tool
      const budgetingHotspot = this.add.rectangle(hotspots[0].x, hotspots[0].y, hotspots[0].width, hotspots[0].height, 0xff0000, 0).setOrigin(0.5);
      this.physics.world.enable(budgetingHotspot);
      this.physics.add.overlap(this.player, budgetingHotspot, () => {
        if (!isPlayerInBudgetingHotspot) {
          setShowBudgetingTool(true);
          setIsPlayerInBudgetingHotspot(true);
        }
      });

      // Hotspot for Credit University
      const creditUniversityHotspot = this.add.image(hotspots[1].x, hotspots[1].y, 'creditu_front').setOrigin(0.5);
      this.physics.world.enable(creditUniversityHotspot);
      this.physics.add.overlap(this.player, creditUniversityHotspot, () => {
        if (!isPlayerInCreditUniversityHotspot) {
          setShowCreditUniversity(true);
          setIsPlayerInCreditUniversityHotspot(true);
        }
      });

      // Hotspot for Credit Score Calculator
      const creditScoreCalculatorHotspot = this.add.image(hotspots[2].x, hotspots[2].y, 'bank_front').setOrigin(0.5);
      this.physics.world.enable(creditScoreCalculatorHotspot);
      this.physics.add.overlap(this.player, creditScoreCalculatorHotspot, () => {
        if (!isPlayerInCreditScoreCalculatorHotspot) {
          setShowCreditScoreCalculator(true);
          setIsPlayerInCreditScoreCalculatorHotspot(true);
        }
      });

      // Hotspot for Alternative Credit Reporting
      const altCreditReportingHotspot = this.add.rectangle(hotspots[3].x, hotspots[3].y, hotspots[3].width, hotspots[3].height, 0x0000ff, 0).setOrigin(0.5);
      this.physics.world.enable(altCreditReportingHotspot);
      this.physics.add.overlap(this.player, altCreditReportingHotspot, () => {
        if (!isPlayerInAlternativeCreditReportingHotspot) {
          setShowAlternativeCreditReporting(true);
          setIsPlayerInAlternativeCreditReportingHotspot(true);
        }
      });
    }

    function update() {
      // Game logic per frame
      this.player.setVelocity(0);

      let animationKey = 'walk_south'; // Default animation

      const leftIsDown = this.cursors.left.isDown || this.wasd.left.isDown;
      const rightIsDown = this.cursors.right.isDown || this.wasd.right.isDown;
      const upIsDown = this.cursors.up.isDown || this.wasd.up.isDown;
      const downIsDown = this.cursors.down.isDown || this.wasd.down.isDown;

      if (leftIsDown) {
        this.player.setVelocityX(-160);
        animationKey = 'walk_west';
      } else if (rightIsDown) {
        this.player.setVelocityX(160);
        animationKey = 'walk_east';
      }

      if (upIsDown) {
        this.player.setVelocityY(-160);
        if (leftIsDown) {
          animationKey = 'walk_north-west';
        } else if (rightIsDown) {
          animationKey = 'walk_north-east';
        } else {
          animationKey = 'walk_north';
        }
      } else if (downIsDown) {
        this.player.setVelocityY(160);
        if (leftIsDown) {
          animationKey = 'walk_south-west';
        } else if (rightIsDown) {
          animationKey = 'walk_south-east';
        } else {
          animationKey = 'walk_south';
        }
      }

      if (this.player.body.velocity.x !== 0 || this.player.body.velocity.y !== 0) {
        this.player.anims.play(animationKey, true);
      } else {
        this.player.anims.stop();
        this.player.setTexture(animationKey.replace('walk_', 'img/characterSprites/rotations/') + '.png'); // Set to a static frame when idle
      }
    }

    return () => {
      game.destroy(true);
    };
  }, [isPlayerInAlternativeCreditReportingHotspot, isPlayerInBudgetingHotspot, isPlayerInCreditScoreCalculatorHotspot, isPlayerInCreditUniversityHotspot]);

  return (
    <div>
      <div id="game-container" style={{ width: '100%', height: '100vh' }} />
      {showBudgetingTool && <BudgetingTool onClose={() => { setShowBudgetingTool(false); setIsPlayerInBudgetingHotspot(false); }} />}
      {showCreditUniversity && <CreditUniversity onClose={() => { setShowCreditUniversity(false); setIsPlayerInCreditUniversityHotspot(false); }} />}
      {showCreditScoreCalculator && <CreditScoreCalculator onClose={() => { setShowCreditScoreCalculator(false); setIsPlayerInCreditScoreCalculatorHotspot(false); }} />}
      {showAlternativeCreditReporting && <AlternativeCreditReporting onClose={() => { setShowAlternativeCreditReporting(false); setIsPlayerInAlternativeCreditReportingHotspot(false); }} />}
    </div>
  );
}

export default Game;
