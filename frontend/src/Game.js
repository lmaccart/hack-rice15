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

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: 'game-container',
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
      // Load assets here
      this.load.image('grass', 'img/bkgdArt/Grass.png');
      this.load.image('player', 'img/characterSprites/rotations/south.png');
      this.load.image('creditu_front', 'img/storefronts/creditu.png');
      this.load.image('bank_front', 'img/storefronts/bank_front.png');
    }

    function create() {
      // Create game objects
      this.add.image(400, 300, 'grass');
      this.player = this.physics.add.sprite(100, 100, 'player');
      this.player.setCollideWorldBounds(true);

      this.cursors = this.input.keyboard.createCursorKeys();

      // Placeholder for interacting with budgeting tool
      const budgetingHotspot = this.add.rectangle(200, 200, 50, 50, 0xff0000, 0.5).setInteractive();
      budgetingHotspot.on('pointerdown', () => {
        setShowBudgetingTool(true);
      });

      // Hotspot for Credit University
      const creditUniversityHotspot = this.add.image(600, 300, 'creditu_front').setInteractive();
      creditUniversityHotspot.on('pointerdown', () => {
        setShowCreditUniversity(true);
      });

      // Hotspot for Credit Score Calculator
      const creditScoreCalculatorHotspot = this.add.image(400, 100, 'bank_front').setInteractive();
      creditScoreCalculatorHotspot.on('pointerdown', () => {
        setShowCreditScoreCalculator(true);
      });

      // Hotspot for Alternative Credit Reporting
      const altCreditReportingHotspot = this.add.rectangle(700, 500, 50, 50, 0x0000ff, 0.5).setInteractive();
      altCreditReportingHotspot.on('pointerdown', () => {
        setShowAlternativeCreditReporting(true);
      });
    }

    function update() {
      // Game logic per frame
      this.player.setVelocity(0);

      if (this.cursors.left.isDown) {
        this.player.setVelocityX(-160);
      } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(160);
      }

      if (this.cursors.up.isDown) {
        this.player.setVelocityY(-160);
      } else if (this.cursors.down.isDown) {
        this.player.setVelocityY(160);
      }
    }

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div>
      <div id="game-container" style={{ width: '800px', height: '600px' }} />
      {showBudgetingTool && <BudgetingTool />}
      {showCreditUniversity && <CreditUniversity />}
      {showCreditScoreCalculator && <CreditScoreCalculator />}
      {showAlternativeCreditReporting && <AlternativeCreditReporting />}
    </div>
  );
}

export default Game;
