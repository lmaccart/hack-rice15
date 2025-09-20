import React, { useEffect, useState, useRef } from 'react';
import Phaser from 'phaser';
import './Game.css';
import BudgetingTool from './BudgetingTool';
import CreditUniversity from './CreditUniversity';
import CreditScoreCalculator from './CreditScoreCalculator';
import AlternativeCreditReporting from './AlternativeCreditReporting';

const tileSize = 40;

class MyScene extends Phaser.Scene {
  constructor() {
    super('MyScene');
    this.player = null;
    this.cursors = null;
    this.wasd = null;
    this.occupiedTiles = new Set();
    this.hotspots = [];
    // These will be set from the React component
    this.setShowBudgetingTool = () => {};
    this.setIsPlayerInBudgetingHotspot = () => {};
    this.setShowCreditUniversity = () => {};
    this.setIsPlayerInCreditUniversityHotspot = () => {};
    this.setShowCreditScoreCalculator = () => {};
    this.setIsPlayerInCreditScoreCalculatorHotspot = () => {};
    this.setShowAlternativeCreditReporting = () => {};
    this.setIsPlayerInAlternativeCreditReportingHotspot = () => {};
  }

  init(data) {
    // Retrieve React state setters from the data passed during scene creation
    this.setShowBudgetingTool = data.setShowBudgetingTool;
    this.setIsPlayerInBudgetingHotspot = data.setIsPlayerInBudgetingHotspot;
    this.setShowCreditUniversity = data.setShowCreditUniversity;
    this.setIsPlayerInCreditUniversityHotspot = data.setIsPlayerInCreditUniversityHotspot;
    this.setShowCreditScoreCalculator = data.setShowCreditScoreCalculator;
    this.setIsPlayerInCreditScoreCalculatorHotspot = data.setIsPlayerInCreditScoreCalculatorHotspot;
    this.setShowAlternativeCreditReporting = data.setShowAlternativeCreditReporting;
    this.setIsPlayerInAlternativeCreditReportingHotspot = data.setIsPlayerInAlternativeCreditReportingHotspot;
  }

  preload() {
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

  create() {
    const numCols = Math.floor(this.sys.game.config.width / tileSize);
    const numRows = Math.floor(this.sys.game.config.height / tileSize);

    // Keep track of occupied tiles
    this.occupiedTiles = new Set();

    // Declare allPathTiles here
    const allPathTiles = [];

    // Mark fence tiles as occupied
    for (let x = 0; x < numCols; x++) {
      this.occupiedTiles.add(`${x},0`);
      this.occupiedTiles.add(`${x},${numRows - 1}`);
    }
    for (let y = 1; y < numRows - 1; y++) {
      this.occupiedTiles.add(`0,${y}`);
      this.occupiedTiles.add(`${numCols - 1},${y}`);
    }

    // Define hotspot regions
    this.hotspots = [
      { x: 5 * tileSize + tileSize / 2, y: 5 * tileSize + tileSize / 2, width: tileSize * 4, height: tileSize * 4, name: 'budgeting' },
      { x: 15 * tileSize + tileSize / 2, y: 7 * tileSize + tileSize / 2, width: tileSize * 4, height: tileSize * 4, name: 'credituniversity' },
      { x: 10 * tileSize + tileSize / 2, y: 3 * tileSize + tileSize / 2, width: tileSize * 4, height: tileSize * 4, name: 'creditscorecalculator' },
      { x: 18 * tileSize + tileSize / 2, y: 12 * tileSize + tileSize / 2, width: tileSize * 4, height: tileSize * 4, name: 'alternativecreditreporting' },
    ];

    // Mark building tiles as occupied
    this.hotspots.forEach(hotspot => {
      const startCol = Math.floor((hotspot.x - hotspot.width / 2) / tileSize);
      const endCol = Math.floor((hotspot.x + hotspot.width / 2) / tileSize);
      const startRow = Math.floor((hotspot.y - hotspot.height / 2) / tileSize);
      const endRow = Math.floor((hotspot.y + hotspot.height / 2) / tileSize);

      for (let y = startRow; y <= endRow; y++) {
        for (let x = startCol; x <= endCol; x++) {
          this.occupiedTiles.add(`${x},${y}`);
        }
      }
    });

    // Draw grass background (across entire grid first)
    for (let y = 0; y < numRows; y++) {
      for (let x = 0; x < numCols; x++) {
        this.add.image(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2, 'grass').setDisplaySize(tileSize, tileSize);
      }
    }

    // Draw fence borders
    this.fences = this.physics.add.staticGroup();
    for (let x = 0; x < numCols; x++) {
      this.fences.create(x * tileSize + tileSize / 2, tileSize / 2, 'fence').setDisplaySize(tileSize, tileSize);
      this.fences.create(x * tileSize + tileSize / 2, (numRows - 1) * tileSize + tileSize / 2, 'fence').setDisplaySize(tileSize, tileSize);
    }
    for (let y = 1; y < numRows - 1; y++) {
      this.fences.create(tileSize / 2, y * tileSize + tileSize / 2, 'fence').setDisplaySize(tileSize, tileSize);
      this.fences.create((numCols - 1) * tileSize + tileSize / 2, y * tileSize + tileSize / 2, 'fence').setDisplaySize(tileSize, tileSize);
    }

    // Mark fence tiles as occupied (after drawing them)
    for (let x = 0; x < numCols; x++) {
      this.occupiedTiles.add(`${x},0`);
      this.occupiedTiles.add(`${x},${numRows - 1}`);
    }
    for (let y = 1; y < numRows - 1; y++) {
      this.occupiedTiles.add(`0,${y}`);
      this.occupiedTiles.add(`${numCols - 1},${y}`);
    }

    // Draw buildings/hotspots
    this.add.image(this.hotspots[0].x, this.hotspots[0].y, 'bank_front').setDisplaySize(this.hotspots[0].width, this.hotspots[0].height);
    this.add.image(this.hotspots[1].x, this.hotspots[1].y, 'creditu_front').setDisplaySize(this.hotspots[1].width, this.hotspots[1].height);
    this.add.image(this.hotspots[2].x, this.hotspots[2].y, 'bank_front').setDisplaySize(this.hotspots[2].width, this.hotspots[2].height);
    this.add.image(this.hotspots[3].x, this.hotspots[3].y, 'bank_front').setDisplaySize(this.hotspots[3].width, this.hotspots[3].height);

    // Example paths (adjust as needed)
    const config = this.sys.game.config; // Re-declare config here for use in drawPath calls
    allPathTiles.push(...this.drawPath(config.width / 2, config.height - tileSize / 2, this.hotspots[0].x, this.hotspots[0].y, config)); // from bottom center to budgeting
    allPathTiles.push(...this.drawPath(this.hotspots[0].x, this.hotspots[0].y, this.hotspots[1].x, this.hotspots[1].y, config)); // budgeting to credit university
    allPathTiles.push(...this.drawPath(this.hotspots[1].x, this.hotspots[1].y, this.hotspots[2].x, this.hotspots[2].y, config)); // credit university to credit score calculator
    allPathTiles.push(...this.drawPath(this.hotspots[2].x, this.hotspots[2].y, this.hotspots[3].x, this.hotspots[3].y, config)); // credit score calculator to alternative credit reporting

    // Scatter random trees
    const numTrees = 100; // adjust as needed (increased from 50)
    for (let i = 0; i < numTrees; i++) {
      let treeX, treeY, treeCol, treeRow;
      let placed = false;
      while (!placed) {
        treeCol = Phaser.Math.Between(1, numCols - 2); // avoid borders
        treeRow = Phaser.Math.Between(1, numRows - 2); // avoid borders
        if (!this.occupiedTiles.has(`${treeCol},${treeRow}`)) {
          treeX = treeCol * tileSize + tileSize / 2;
          treeY = treeRow * tileSize + tileSize / 2;
          this.add.image(treeX, treeY, 'tree').setDisplaySize(tileSize, tileSize);
          this.occupiedTiles.add(`${treeCol},${treeRow}`);
          placed = true;
        }
      }
    }

    // Calculate a safe spawn position
    const spawnPaddingTiles = 3; // 3 tiles padding
    let safeSpawnX, safeSpawnY;
    let isSafe = false;

    while (!isSafe) {
      const spawnCol = Phaser.Math.Between(spawnPaddingTiles, numCols - 1 - spawnPaddingTiles);
      const spawnRow = Phaser.Math.Between(spawnPaddingTiles, numRows - 1 - spawnPaddingTiles);
      
      isSafe = true;
      // Check if spawn area is clear of occupied tiles
      for (let y = spawnRow - 1; y <= spawnRow + 1; y++) {
        for (let x = spawnCol - 1; x <= spawnCol + 1; x++) {
          if (this.occupiedTiles.has(`${x},${y}`)) {
            isSafe = false;
            break;
          }
        }
        if (!isSafe) break;
      }

      if (isSafe) {
        safeSpawnX = spawnCol * tileSize + tileSize / 2;
        safeSpawnY = spawnRow * tileSize + tileSize / 2;
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
    const budgetingHotspot = this.add.rectangle(this.hotspots[0].x, this.hotspots[0].y, this.hotspots[0].width, this.hotspots[0].height, 0xff0000, 0).setOrigin(0.5);
    this.physics.world.enable(budgetingHotspot);
    this.physics.add.overlap(this.player, budgetingHotspot, () => {
      if (!this.isPlayerInBudgetingHotspot) {
        this.setShowBudgetingTool(true);
        this.setIsPlayerInBudgetingHotspot(true);
      }
    });

    // Hotspot for Credit University
    const creditUniversityHotspot = this.add.image(this.hotspots[1].x, this.hotspots[1].y, 'creditu_front').setDisplaySize(this.hotspots[1].width, this.hotspots[1].height).setOrigin(0.5);
    this.physics.world.enable(creditUniversityHotspot);
    this.physics.add.overlap(this.player, creditUniversityHotspot, () => {
      if (!this.isPlayerInCreditUniversityHotspot) {
        this.setShowCreditUniversity(true);
        this.setIsPlayerInCreditUniversityHotspot(true);
      }
    });

    // Hotspot for Credit Score Calculator
    const creditScoreCalculatorHotspot = this.add.image(this.hotspots[2].x, this.hotspots[2].y, 'bank_front').setDisplaySize(this.hotspots[2].width, this.hotspots[2].height).setOrigin(0.5);
    this.physics.world.enable(creditScoreCalculatorHotspot);
    this.physics.add.overlap(this.player, creditScoreCalculatorHotspot, () => {
      if (!this.isPlayerInCreditScoreCalculatorHotspot) {
        this.setShowCreditScoreCalculator(true);
        this.setIsPlayerInCreditScoreCalculatorHotspot(true);
      }
    });

    // Hotspot for Alternative Credit Reporting
    const altCreditReportingHotspot = this.add.rectangle(this.hotspots[3].x, this.hotspots[3].y, this.hotspots[3].width, this.hotspots[3].height, 0x0000ff, 0).setOrigin(0.5);
    this.physics.world.enable(altCreditReportingHotspot);
    this.physics.add.overlap(this.player, altCreditReportingHotspot, () => {
      if (!this.isPlayerInAlternativeCreditReportingHotspot) {
        this.setShowAlternativeCreditReporting(true);
        this.setIsPlayerInAlternativeCreditReportingHotspot(true);
      }
    });
  }

  update() {
    // Game logic per frame
    this.player.setVelocity(0);

    let animationKey = this.player.anims.currentAnim ? this.player.anims.currentAnim.key : 'walk_south'; // Default to south if no animation is playing

    const leftIsDown = this.cursors.left.isDown || this.wasd.left.isDown;
    const rightIsDown = this.cursors.right.isDown || this.wasd.right.isDown;
    const upIsDown = this.cursors.up.isDown || this.wasd.up.isDown;
    const downIsDown = this.cursors.down.isDown || this.wasd.down.isDown;

    const playerSpeed = 80; // Decreased speed

    if (leftIsDown) {
      this.player.setVelocityX(-playerSpeed);
      animationKey = 'walk_west';
    } else if (rightIsDown) {
      this.player.setVelocityX(playerSpeed);
      animationKey = 'walk_east';
    }

    if (upIsDown) {
      this.player.setVelocityY(-playerSpeed);
      if (leftIsDown) {
        animationKey = 'walk_north-west';
      } else if (rightIsDown) {
        animationKey = 'walk_north-east';
      } else {
        animationKey = 'walk_north';
      }
    } else if (downIsDown) {
      this.player.setVelocityY(playerSpeed);
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
      // Set to the last frame of the last played animation when idle
      if (this.player.anims.currentFrame) {
        this.player.setTexture(this.player.anims.currentFrame.textureKey, this.player.anims.currentFrame.frame.name);
      } else {
        // If no animation has played yet, default to south static frame
        this.player.setTexture('walk_south_0');
      }
    }
  }

  drawPath(startX, startY, endX, endY, config) {
    const pathTiles = new Set();
    // const config = this.sys.game.config; // Removed: config is now passed as a parameter

    let currentX = Math.floor(startX / tileSize);
    let currentY = Math.floor(startY / tileSize);
    const targetX = Math.floor(endX / tileSize);
    const targetY = Math.floor(endY / tileSize);

    // Move horizontally first
    while (currentX !== targetX) {
      const tileKey = `${currentX},${currentY}`;
      if (!this.occupiedTiles.has(tileKey)) {
        pathTiles.add(tileKey);
        this.add.image(currentX * tileSize + tileSize / 2, currentY * tileSize + tileSize / 2, 'path').setDisplaySize(tileSize, tileSize);
        this.occupiedTiles.add(tileKey); // Mark as occupied
      }
      if (currentX < targetX) {
        currentX++;
      } else {
        currentX--;
      }
    }

    // Then move vertically
    while (currentY !== targetY) {
      const tileKey = `${currentX},${currentY}`;
      if (!this.occupiedTiles.has(tileKey)) {
        pathTiles.add(tileKey);
        this.add.image(currentX * tileSize + tileSize / 2, currentY * tileSize + tileSize / 2, 'path').setDisplaySize(tileSize, tileSize);
        this.occupiedTiles.add(tileKey); // Mark as occupied
      }
      if (currentY < targetY) {
        currentY++;
      } else {
        currentY--;
      }
    }
    const finalTileKey = `${currentX},${currentY}`;
    if (!this.occupiedTiles.has(finalTileKey)) {
      pathTiles.add(finalTileKey); // Add the final tile
      this.add.image(currentX * tileSize + tileSize / 2, currentY * tileSize + tileSize / 2, 'path').setDisplaySize(tileSize, tileSize);
      this.occupiedTiles.add(finalTileKey); // Mark as occupied
    }

    pathTiles.forEach(tile => this.occupiedTiles.add(tile));
    return Array.from(pathTiles); // Return path tiles for spawn calculation
  }

  teleportPlayerAway(hotspotX, hotspotY) {
    const playerTileX = Math.floor(this.player.x / tileSize);
    const playerTileY = Math.floor(this.player.y / tileSize);
    const hotspotTileX = Math.floor(hotspotX / tileSize);
    const hotspotTileY = Math.floor(hotspotY / tileSize);

    let newPlayerTileX = playerTileX;
    let newPlayerTileY = playerTileY;

    // Try to move one tile away horizontally or vertically
    if (playerTileX === hotspotTileX) {
      // Player is directly above or below the hotspot
      if (playerTileY < hotspotTileY) {
        newPlayerTileY = hotspotTileY - 1; // Move up
      } else {
        newPlayerTileY = hotspotTileY + Math.ceil(this.hotspots[0].height / tileSize); // Move down
      }
    } else if (playerTileY === hotspotTileY) {
      // Player is directly left or right of the hotspot
      if (playerTileX < hotspotTileX) {
        newPlayerTileX = hotspotTileX - 1; // Move left
      } else {
        newPlayerTileX = hotspotTileX + Math.ceil(this.hotspots[0].width / tileSize); // Move right
      }
    } else {
      // Player is diagonally from the hotspot, move horizontally first
      if (playerTileX < hotspotTileX) {
        newPlayerTileX = hotspotTileX - 1;
      } else {
        newPlayerTileX = hotspotTileX + Math.ceil(this.hotspots[0].width / tileSize);
      }
    }

    // Ensure new position is within bounds and not occupied
    const targetX = newPlayerTileX * tileSize + tileSize / 2;
    const targetY = newPlayerTileY * tileSize + tileSize / 2;

    // Basic boundary check (can be more robust)
    if (targetX > tileSize && targetX < this.sys.game.config.width - tileSize &&
        targetY > tileSize && targetY < this.sys.game.config.height - tileSize &&
        !this.occupiedTiles.has(`${newPlayerTileX},${newPlayerTileY}`)) {
      this.player.setPosition(targetX, targetY);
    } else {
      // Fallback: if target is invalid, try another direction or just move to a default safe spot
      // For simplicity, we'll just move to a fixed spot if the calculated one is invalid
      this.player.setPosition(this.sys.game.config.width / 2, this.sys.game.config.height / 2); // Center of the map as a fallback
    }
  }
}

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

  const gameRef = useRef(null); // Create a ref for the Phaser game instance

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
      scene: MyScene,
    };

    const game = new Phaser.Game(config);
    gameRef.current = game; // Store the game instance in the ref

    game.events.on('ready', () => {
      const myScene = game.scene.getScene('MyScene');
      if (myScene) {
        // Expose React state setters to the Phaser Scene
        myScene.setShowBudgetingTool = setShowBudgetingTool;
        myScene.setIsPlayerInBudgetingHotspot = setIsPlayerInBudgetingHotspot;
        myScene.setShowCreditUniversity = setShowCreditUniversity;
        myScene.setIsPlayerInCreditUniversityHotspot = setIsPlayerInCreditUniversityHotspot;
        myScene.setShowCreditScoreCalculator = setShowCreditScoreCalculator;
        myScene.setIsPlayerInCreditScoreCalculatorHotspot = setIsPlayerInCreditScoreCalculatorHotspot;
        myScene.setShowAlternativeCreditReporting = setShowAlternativeCreditReporting;
        myScene.setIsPlayerInAlternativeCreditReportingHotspot = setIsPlayerInAlternativeCreditReportingHotspot;

        // Expose teleportPlayerAway to React components
        myScene.teleportPlayerAway = myScene.teleportPlayerAway.bind(myScene);
      }
    });

    return () => {
      gameRef.current.destroy(true);
    };
  }, [setShowBudgetingTool, setIsPlayerInBudgetingHotspot, setShowCreditUniversity, setIsPlayerInCreditUniversityHotspot, setShowCreditScoreCalculator, setIsPlayerInCreditScoreCalculatorHotspot, setShowAlternativeCreditReporting, setIsPlayerInAlternativeCreditReportingHotspot, gameRef]);

  return (
    <div>
      <div id="game-container" style={{ width: '100%', height: '100vh' }} />
      {showBudgetingTool && <BudgetingTool onClose={() => { setShowBudgetingTool(false); gameRef.current.scene.getScene('MyScene').setIsPlayerInBudgetingHotspot(false); gameRef.current.scene.getScene('MyScene').teleportPlayerAway(gameRef.current.scene.getScene('MyScene').hotspots[0].x, gameRef.current.scene.getScene('MyScene').hotspots[0].y); }} />}
      {showCreditUniversity && <CreditUniversity onClose={() => { setShowCreditUniversity(false); gameRef.current.scene.getScene('MyScene').setIsPlayerInCreditUniversityHotspot(false); gameRef.current.scene.getScene('MyScene').teleportPlayerAway(gameRef.current.scene.getScene('MyScene').hotspots[1].x, gameRef.current.scene.getScene('MyScene').hotspots[1].y); }} />}
      {showCreditScoreCalculator && <CreditScoreCalculator onClose={() => { setShowCreditScoreCalculator(false); gameRef.current.scene.getScene('MyScene').setIsPlayerInCreditScoreCalculatorHotspot(false); gameRef.current.scene.getScene('MyScene').teleportPlayerAway(gameRef.current.scene.getScene('MyScene').hotspots[2].x, gameRef.current.scene.getScene('MyScene').hotspots[2].y); }} />}
      {showAlternativeCreditReporting && <AlternativeCreditReporting onClose={() => { setShowAlternativeCreditReporting(false); gameRef.current.scene.getScene('MyScene').setIsPlayerInAlternativeCreditReportingHotspot(false); gameRef.current.scene.getScene('MyScene').teleportPlayerAway(gameRef.current.scene.getScene('MyScene').hotspots[3].x, gameRef.current.scene.getScene('MyScene').hotspots[3].y); }} />}
    </div>
  );
}

export default Game;
