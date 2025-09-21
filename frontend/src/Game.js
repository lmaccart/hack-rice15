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
    this.setShowCentralCreditUniversity = () => {};
    this.setIsPlayerInCentralCreditUniversityHotspot = () => {};
    this.setShowTownHall = () => {};
    this.setIsPlayerInTownHallHotspot = () => {};
    this.setShowShop = () => {};
    this.setIsPlayerInShopHotspot = () => {};
    this.setShowBistro = () => {};
    this.setIsPlayerInBistroHotspot = () => {};
    this.setShowPoliceStation = () => {};
    this.setIsPlayerInPoliceStationHotspot = () => {};
    this.showBudgetingTool = false; // New property to hold the state from React
    this.showCreditUniversity = false; // New property
    this.showCreditScoreCalculator = false; // New property
    this.showAlternativeCreditReporting = false; // New property
    this.showCentralCreditUniversity = false; // New property for central Credit University
    this.showTownHall = false; // New property
    this.showShop = false; // New property
    this.showBistro = false; // New property
    this.showPoliceStation = false; // New property
    this.hasExitedBudgetingHotspot = true; // New property for cooldown
    this.hasExitedCreditUniversityHotspot = true; // New property for cooldown
    this.hasExitedCreditScoreCalculatorHotspot = true; // New property for cooldown
    this.hasExitedAlternativeCreditReportingHotspot = true; // New property for cooldown
    this.hasExitedCentralCreditUniversityHotspot = true; // New property for cooldown
    this.hasExitedTownHallHotspot = true; // New property for cooldown
    this.hasExitedShopHotspot = true; // New property for cooldown
    this.hasExitedBistroHotspot = true; // New property for cooldown
    this.hasExitedPoliceStationHotspot = true; // New property for cooldown
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
    this.setShowCentralCreditUniversity = data.setShowCentralCreditUniversity;
    this.setIsPlayerInCentralCreditUniversityHotspot = data.setIsPlayerInCentralCreditUniversityHotspot;
    this.setShowTownHall = data.setShowTownHall;
    this.setIsPlayerInTownHallHotspot = data.setIsPlayerInTownHallHotspot;
    this.setShowShop = data.setShowShop;
    this.setIsPlayerInShopHotspot = data.setIsPlayerInShopHotspot;
    this.setShowBistro = data.setShowBistro;
    this.setIsPlayerInBistroHotspot = data.setIsPlayerInBistroHotspot;
    this.setShowPoliceStation = data.setShowPoliceStation;
    this.setIsPlayerInPoliceStationHotspot = data.setIsPlayerInPoliceStationHotspot;
    this.showBudgetingTool = data.showBudgetingTool; // Set the property from passed data
    this.showCreditUniversity = data.showCreditUniversity; // Set the property
    this.showCreditScoreCalculator = data.showCreditScoreCalculator; // Set the property
    this.showAlternativeCreditReporting = data.showAlternativeCreditReporting; // Set the property
    this.showCentralCreditUniversity = data.showCentralCreditUniversity; // Set the property for central Credit University
    this.showTownHall = data.showTownHall; // Set the property
    this.showShop = data.showShop; // Set the property
    this.showBistro = data.showBistro; // Set the property
    this.showPoliceStation = data.showPoliceStation; // Set the property
    this.hasExitedBudgetingHotspot = data.hasExitedBudgetingHotspot; // Set the property for cooldown
    this.hasExitedCreditUniversityHotspot = data.hasExitedCreditUniversityHotspot; // Set the property for cooldown
    this.hasExitedCreditScoreCalculatorHotspot = data.hasExitedCreditScoreCalculatorHotspot; // Set the property for cooldown
    this.hasExitedAlternativeCreditReportingHotspot = data.hasExitedAlternativeCreditReportingHotspot; // Set the property for cooldown
    this.hasExitedCentralCreditUniversityHotspot = data.hasExitedCentralCreditUniversityHotspot; // Set the property for cooldown
    this.hasExitedTownHallHotspot = data.hasExitedTownHallHotspot; // Set the property for cooldown
    this.hasExitedShopHotspot = data.hasExitedShopHotspot; // Set the property for cooldown
    this.hasExitedBistroHotspot = data.hasExitedBistroHotspot; // Set the property for cooldown
    this.hasExitedPoliceStationHotspot = data.hasExitedPoliceStationHotspot; // Set the property for cooldown
  }

  preload() {
    this.load.image('grass', 'img/bkgdArt/Grass.png');
    this.load.image('fence', 'img/bkgdArt/Fence.png');
    this.load.image('path', 'img/bkgdArt/Path.png');
    this.load.image('tree', 'img/bkgdArt/Tree.png');
    this.load.image('autumnal_tree', 'img/bkgdArt/Autumnal_Tree_2.png');
    this.load.image('fence_vertical', 'img/bkgdArt/fence vertical.png');
    this.load.image('bank_front', 'img/storefronts/bank_front.png');
    this.load.image('creditu_front', 'img/storefronts/creditu.png');
    this.load.image('townhall_front', 'img/bkgdArt/townhsll.png');
    this.load.image('shop_front', 'img/bkgdArt/shop.png');
    this.load.image('bistro_front', 'img/bkgdArt/bistro.png');

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
      { x: 5 * tileSize + tileSize / 2, y: 5 * tileSize + tileSize / 2, width: tileSize * 4, height: tileSize * 4, name: 'credituniversity' }, // Top-left Credit University
      { x: (numCols - 5) * tileSize + tileSize / 2, y: 5 * tileSize + tileSize / 2, width: tileSize * 4, height: tileSize * 4, name: 'bank' }, // Top-right Bank
      { x: 9 * tileSize + tileSize / 2, y: 9 * tileSize + tileSize / 2, width: tileSize * 3, height: tileSize * 3, name: 'townhall' }, // Center-left Town Hall
      { x: (numCols - 9) * tileSize + tileSize / 2, y: 9 * tileSize + tileSize / 2, width: tileSize * 3, height: tileSize * 3, name: 'shop' }, // Center-right Shop
      { x: (numCols - 5) * tileSize + tileSize / 2, y: 9 * tileSize + tileSize / 2, width: tileSize * 3, height: tileSize * 3, name: 'bistro' }, // Center-right Bistro
      { x: numCols / 2 * tileSize + tileSize / 2, y: (numRows - 5) * tileSize + tileSize / 2, width: tileSize * 4, height: tileSize * 4, name: 'policestation' }, // Bottom-center Police Station
    ];

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
      this.fences.create(tileSize / 2, y * tileSize + tileSize / 2, 'fence_vertical').setDisplaySize(tileSize, tileSize);
      this.fences.create((numCols - 1) * tileSize + tileSize / 2, y * tileSize + tileSize / 2, 'fence_vertical').setDisplaySize(tileSize, tileSize);
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

    // Example paths (adjust as needed)
    const config = this.sys.game.config; // Re-declare config here for use in drawPath calls

    // Paths based on the provided image
    const centerX = numCols / 2 * tileSize + tileSize / 2;
    const centerY = numRows / 2 * tileSize + tileSize / 2;

    // Central vertical path
    allPathTiles.push(...this.drawPath(centerX, 0, centerX, numRows * tileSize, config));
    // Central horizontal path (connecting Town Hall, Shop, Bistro)
    allPathTiles.push(...this.drawPath(0, 9 * tileSize + tileSize / 2, numCols * tileSize, 9 * tileSize + tileSize / 2, config));

    // Path to Credit University (hotspots[0])
    allPathTiles.push(...this.drawPath(centerX, 5 * tileSize + tileSize / 2, this.hotspots[0].x, this.hotspots[0].y, config));
    // Path to Bank (hotspots[1])
    allPathTiles.push(...this.drawPath(centerX, 5 * tileSize + tileSize / 2, this.hotspots[1].x, this.hotspots[1].y, config));
    // Path to Town Hall (hotspots[2])
    allPathTiles.push(...this.drawPath(centerX, 9 * tileSize + tileSize / 2, this.hotspots[2].x, this.hotspots[2].y, config));
    // Path from Town Hall to Shop (hotspots[3])
    allPathTiles.push(...this.drawPath(this.hotspots[2].x, this.hotspots[2].y, this.hotspots[3].x, this.hotspots[3].y, config));
    // Path from Shop to Bistro (hotspots[4])
    allPathTiles.push(...this.drawPath(this.hotspots[3].x, this.hotspots[3].y, this.hotspots[4].x, this.hotspots[4].y, config));
    // Path to Police Station (hotspots[5])
    allPathTiles.push(...this.drawPath(centerX, (numRows - 5) * tileSize + tileSize / 2, this.hotspots[5].x, this.hotspots[5].y, config));

    // Mark building tiles as occupied (moved here to allow paths underneath)
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

    // Draw buildings/hotspots
    this.add.image(this.hotspots[0].x, this.hotspots[0].y, 'creditu_front').setDisplaySize(this.hotspots[0].width, this.hotspots[0].height); // Credit University
    this.add.image(this.hotspots[1].x, this.hotspots[1].y, 'bank_front').setDisplaySize(this.hotspots[1].width, this.hotspots[1].height); // Bank
    this.add.image(this.hotspots[2].x, this.hotspots[2].y, 'townhall_front').setDisplaySize(this.hotspots[2].width, this.hotspots[2].height); // Town Hall
    this.add.image(this.hotspots[3].x, this.hotspots[3].y, 'shop_front').setDisplaySize(this.hotspots[3].width, this.hotspots[3].height); // Shop
    this.add.image(this.hotspots[4].x, this.hotspots[4].y, 'bistro_front').setDisplaySize(this.hotspots[4].width, this.hotspots[4].height); // Bistro
    this.add.image(this.hotspots[5].x, this.hotspots[5].y, 'bank_front').setDisplaySize(this.hotspots[5].width, this.hotspots[5].height); // Police Station (using bank_front as placeholder)

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
          const treeType = Phaser.Math.Between(0, 1) === 0 ? 'tree' : 'autumnal_tree';
          this.add.image(treeX, treeY, treeType).setDisplaySize(tileSize, tileSize);
          this.occupiedTiles.add(`${treeCol},${treeRow}`);
          placed = true;
        }
      }
    }

    // Calculate a safe spawn position
    // Spawn player near the center of the map
    let safeSpawnX = numCols / 2 * tileSize + tileSize / 2;
    let safeSpawnY = (numRows / 2 + 2) * tileSize + tileSize / 2; // Slightly below the central horizontal path

    this.player = this.physics.add.sprite(safeSpawnX, safeSpawnY, 'walk_south_0');
    this.player.setCollideWorldBounds(true);

    // Set up camera to follow the player
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
    this.cameras.main.setZoom(3); // Adjust zoom level as needed

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
      if (!this.isPlayerInBudgetingHotspot && this.hasExitedBudgetingHotspot && !this.showCreditUniversity && !this.showCreditScoreCalculator && !this.showAlternativeCreditReporting && !this.showCentralCreditUniversity) {
        this.setShowBudgetingTool(true);
        this.setIsPlayerInBudgetingHotspot(true);
        this.setHasExitedBudgetingHotspot(false);
      }
    });
    this.physics.add.overlap(this.player, budgetingHotspot, () => {},
      (player, hotspot) => {},
      this
    );
    this.physics.world.on('overlapend', (gameObject1, gameObject2, body1, body2) => {
      if (gameObject1 === this.player && gameObject2 === budgetingHotspot) {
        this.setHasExitedBudgetingHotspot(true);
      }
    });

    // Hotspot for Credit University (now hotspots[0])
    const creditUniversityHotspot = this.add.image(this.hotspots[0].x, this.hotspots[0].y, 'creditu_front').setDisplaySize(this.hotspots[0].width, this.hotspots[0].height).setOrigin(0.5);
    this.physics.world.enable(creditUniversityHotspot);
    this.physics.add.overlap(this.player, creditUniversityHotspot, () => {
      if (!this.isPlayerInCreditUniversityHotspot && this.hasExitedCreditUniversityHotspot && !this.showBudgetingTool && !this.showCreditScoreCalculator && !this.showAlternativeCreditReporting && !this.showCentralCreditUniversity && !this.showTownHall && !this.showShop && !this.showBistro && !this.showPoliceStation) {
        this.setShowCreditUniversity(true);
        this.setIsPlayerInCreditUniversityHotspot(true);
        this.setHasExitedCreditUniversityHotspot(false);
      }
    });
    this.physics.world.on('overlapend', (gameObject1, gameObject2, body1, body2) => {
      if (gameObject1 === this.player && gameObject2 === creditUniversityHotspot) {
        this.setHasExitedCreditUniversityHotspot(true);
      }
    });

    // Hotspot for Bank (now hotspots[1]) - using BudgetingTool for now
    const bankHotspot = this.add.image(this.hotspots[1].x, this.hotspots[1].y, 'bank_front').setDisplaySize(this.hotspots[1].width, this.hotspots[1].height).setOrigin(0.5);
    this.physics.world.enable(bankHotspot);
    this.physics.add.overlap(this.player, bankHotspot, () => {
      if (!this.isPlayerInBudgetingHotspot && this.hasExitedBudgetingHotspot && !this.showCreditUniversity && !this.showCreditScoreCalculator && !this.showAlternativeCreditReporting && !this.showCentralCreditUniversity && !this.showTownHall && !this.showShop && !this.showBistro && !this.showPoliceStation) {
        this.setShowBudgetingTool(true);
        this.setIsPlayerInBudgetingHotspot(true);
        this.setHasExitedBudgetingHotspot(false);
      }
    });
    this.physics.world.on('overlapend', (gameObject1, gameObject2, body1, body2) => {
      if (gameObject1 === this.player && gameObject2 === bankHotspot) {
        this.setHasExitedBudgetingHotspot(true);
      }
    });

    // Hotspot for Town Hall (hotspots[2]) - using BudgetingTool for now
    const townHallHotspot = this.add.image(this.hotspots[2].x, this.hotspots[2].y, 'townhall_front').setDisplaySize(this.hotspots[2].width, this.hotspots[2].height).setOrigin(0.5);
    this.physics.world.enable(townHallHotspot);
    this.physics.add.overlap(this.player, townHallHotspot, () => {
      if (!this.isPlayerInTownHallHotspot && this.hasExitedTownHallHotspot && !this.showBudgetingTool && !this.showCreditUniversity && !this.showCreditScoreCalculator && !this.showAlternativeCreditReporting && !this.showCentralCreditUniversity && !this.showShop && !this.showBistro && !this.showPoliceStation) {
        this.setShowTownHall(true);
        this.setIsPlayerInTownHallHotspot(true);
        this.setHasExitedTownHallHotspot(false);
      }
    });
    this.physics.world.on('overlapend', (gameObject1, gameObject2, body1, body2) => {
      if (gameObject1 === this.player && gameObject2 === townHallHotspot) {
        this.setHasExitedTownHallHotspot(true);
      }
    });

    // Hotspot for Shop (hotspots[3]) - using CreditUniversity for now
    const shopHotspot = this.add.image(this.hotspots[3].x, this.hotspots[3].y, 'shop_front').setDisplaySize(this.hotspots[3].width, this.hotspots[3].height).setOrigin(0.5);
    this.physics.world.enable(shopHotspot);
    this.physics.add.overlap(this.player, shopHotspot, () => {
      if (!this.isPlayerInShopHotspot && this.hasExitedShopHotspot && !this.showBudgetingTool && !this.showCreditUniversity && !this.showCreditScoreCalculator && !this.showAlternativeCreditReporting && !this.showCentralCreditUniversity && !this.showTownHall && !this.showBistro && !this.showPoliceStation) {
        this.setShowShop(true);
        this.setIsPlayerInShopHotspot(true);
        this.setHasExitedShopHotspot(false);
      }
    });
    this.physics.world.on('overlapend', (gameObject1, gameObject2, body1, body2) => {
      if (gameObject1 === this.player && gameObject2 === shopHotspot) {
        this.setHasExitedShopHotspot(true);
      }
    });

    // Hotspot for Bistro (hotspots[4]) - using CreditScoreCalculator for now
    const bistroHotspot = this.add.image(this.hotspots[4].x, this.hotspots[4].y, 'bistro_front').setDisplaySize(this.hotspots[4].width, this.hotspots[4].height).setOrigin(0.5);
    this.physics.world.enable(bistroHotspot);
    this.physics.add.overlap(this.player, bistroHotspot, () => {
      if (!this.isPlayerInBistroHotspot && this.hasExitedBistroHotspot && !this.showBudgetingTool && !this.showCreditUniversity && !this.showCreditScoreCalculator && !this.showAlternativeCreditReporting && !this.showCentralCreditUniversity && !this.showTownHall && !this.showShop && !this.showPoliceStation) {
        this.setShowBistro(true);
        this.setIsPlayerInBistroHotspot(true);
        this.setHasExitedBistroHotspot(false);
      }
    });
    this.physics.world.on('overlapend', (gameObject1, gameObject2, body1, body2) => {
      if (gameObject1 === this.player && gameObject2 === bistroHotspot) {
        this.setHasExitedBistroHotspot(true);
      }
    });

    // Hotspot for Police Station (hotspots[5]) - using AlternativeCreditReporting for now
    const policeStationHotspot = this.add.image(this.hotspots[5].x, this.hotspots[5].y, 'bank_front').setDisplaySize(this.hotspots[5].width, this.hotspots[5].height).setOrigin(0.5);
    this.physics.world.enable(policeStationHotspot);
    this.physics.add.overlap(this.player, policeStationHotspot, () => {
      if (!this.isPlayerInPoliceStationHotspot && this.hasExitedPoliceStationHotspot && !this.showBudgetingTool && !this.showCreditUniversity && !this.showCreditScoreCalculator && !this.showAlternativeCreditReporting && !this.showCentralCreditUniversity && !this.showTownHall && !this.showShop && !this.showBistro) {
        this.setShowPoliceStation(true);
        this.setIsPlayerInPoliceStationHotspot(true);
        this.setHasExitedPoliceStationHotspot(false);
      }
    });
    this.physics.world.on('overlapend', (gameObject1, gameObject2, body1, body2) => {
      if (gameObject1 === this.player && gameObject2 === policeStationHotspot) {
        this.setHasExitedPoliceStationHotspot(true);
      }
    });
  }

  update() {
    const isAnyPopupOpen = this.showBudgetingTool || this.showCreditUniversity || this.showCreditScoreCalculator || this.showAlternativeCreditReporting || this.showCentralCreditUniversity || this.showTownHall || this.showShop || this.showBistro || this.showPoliceStation;

    if (isAnyPopupOpen) {
      // If any popup is open, stop player movement and disable keyboard input
      this.player.setVelocity(0);
      this.player.anims.stop();
      if (this.input.keyboard.enabled) {
        this.input.keyboard.enabled = false;
      }
      return;
    } else {
      // If no popups are open, ensure keyboard input is enabled
      if (!this.input.keyboard.enabled) {
        this.input.keyboard.enabled = true;
      }
    }

    // Game logic per frame
    this.player.setVelocity(0);

    let animationKey = this.player.anims.currentAnim ? this.player.anims.currentAnim.key : 'walk_south'; // Default to south if no animation is playing

    const leftIsDown = this.cursors.left.isDown || this.wasd.left.isDown;
    const rightIsDown = this.cursors.right.isDown || this.wasd.right.isDown;
    const upIsDown = this.cursors.up.isDown || this.wasd.up.isDown;
    const downIsDown = this.cursors.down.isDown || this.wasd.down.isDown;

    const playerSpeed = 160;

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

    // pathTiles.forEach(tile => this.occupiedTiles.add(tile)); // This is now handled within the loops
    return pathTiles;
  }

}

function Game() {
  const [showBudgetingTool, setShowBudgetingTool] = useState(false);
  const [showCreditUniversity, setShowCreditUniversity] = useState(false);
  const [showCreditScoreCalculator, setShowCreditScoreCalculator] = useState(false);
  const [showAlternativeCreditReporting, setShowAlternativeCreditReporting] = useState(false);
  const [showCentralCreditUniversity, setShowCentralCreditUniversity] = useState(false);
  const [showTownHall, setShowTownHall] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showBistro, setShowBistro] = useState(false);
  const [showPoliceStation, setShowPoliceStation] = useState(false);

  // new state variables to track if player is in hotspot
  const [isPlayerInBudgetingHotspot, setIsPlayerInBudgetingHotspot] = useState(false);
  const [isPlayerInCreditUniversityHotspot, setIsPlayerInCreditUniversityHotspot] = useState(false);
  const [isPlayerInCreditScoreCalculatorHotspot, setIsPlayerInCreditScoreCalculatorHotspot] = useState(false);
  const [isPlayerInAlternativeCreditReportingHotspot, setIsPlayerInAlternativeCreditReportingHotspot] = useState(false);
  const [isPlayerInCentralCreditUniversityHotspot, setIsPlayerInCentralCreditUniversityHotspot] = useState(false);
  const [isPlayerInTownHallHotspot, setIsPlayerInTownHallHotspot] = useState(false);
  const [isPlayerInShopHotspot, setIsPlayerInShopHotspot] = useState(false);
  const [isPlayerInBistroHotspot, setIsPlayerInBistroHotspot] = useState(false);
  const [isPlayerInPoliceStationHotspot, setIsPlayerInPoliceStationHotspot] = useState(false);

  // New state variables for popup cooldown
  const [hasExitedBudgetingHotspot, setHasExitedBudgetingHotspot] = useState(true);
  const [hasExitedCreditUniversityHotspot, setHasExitedCreditUniversityHotspot] = useState(true);
  const [hasExitedCreditScoreCalculatorHotspot, setHasExitedCreditScoreCalculatorHotspot] = useState(true);
  const [hasExitedAlternativeCreditReportingHotspot, setHasExitedAlternativeCreditReportingHotspot] = useState(true);
  const [hasExitedCentralCreditUniversityHotspot, setHasExitedCentralCreditUniversityHotspot] = useState(true);
  const [hasExitedTownHallHotspot, setHasExitedTownHallHotspot] = useState(true);
  const [hasExitedShopHotspot, setHasExitedShopHotspot] = useState(true);
  const [hasExitedBistroHotspot, setHasExitedBistroHotspot] = useState(true);
  const [hasExitedPoliceStationHotspot, setHasExitedPoliceStationHotspot] = useState(true);

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
        myScene.setShowCentralCreditUniversity = setShowCentralCreditUniversity;
        myScene.setIsPlayerInCentralCreditUniversityHotspot = setIsPlayerInCentralCreditUniversityHotspot;
        myScene.setShowTownHall = setShowTownHall;
        myScene.setIsPlayerInTownHallHotspot = setIsPlayerInTownHallHotspot;
        myScene.setShowShop = setShowShop;
        myScene.setIsPlayerInShopHotspot = setIsPlayerInShopHotspot;
        myScene.setShowBistro = setShowBistro;
        myScene.setIsPlayerInBistroHotspot = setIsPlayerInBistroHotspot;
        myScene.setShowPoliceStation = setShowPoliceStation;
        myScene.setIsPlayerInPoliceStationHotspot = setIsPlayerInPoliceStationHotspot;

        // Expose React state setters for cooldown
        myScene.setHasExitedBudgetingHotspot = setHasExitedBudgetingHotspot;
        myScene.setHasExitedCreditUniversityHotspot = setHasExitedCreditUniversityHotspot;
        myScene.setHasExitedCreditScoreCalculatorHotspot = setHasExitedCreditScoreCalculatorHotspot;
        myScene.setHasExitedAlternativeCreditReportingHotspot = setHasExitedAlternativeCreditReportingHotspot;
        myScene.setHasExitedCentralCreditUniversityHotspot = setHasExitedCentralCreditUniversityHotspot;
        myScene.setHasExitedTownHallHotspot = setHasExitedTownHallHotspot;
        myScene.setHasExitedShopHotspot = setHasExitedShopHotspot;
        myScene.setHasExitedBistroHotspot = setHasExitedBistroHotspot;
        myScene.setHasExitedPoliceStationHotspot = setHasExitedPoliceStationHotspot;

        // Pass current state of popups to the scene
        // These will be updated directly in the onClose handlers now
        // myScene.showBudgetingTool = showBudgetingTool;
        // myScene.showCreditUniversity = showCreditUniversity;
        // myScene.showCreditScoreCalculator = showCreditScoreCalculator;
        // myScene.showAlternativeCreditReporting = showAlternativeCreditReporting;
        myScene.showCentralCreditUniversity = showCentralCreditUniversity;
        myScene.showTownHall = showTownHall;
        myScene.showShop = showShop;
        myScene.showBistro = showBistro;
        myScene.showPoliceStation = showPoliceStation;

        // Pass current state of cooldowns to the scene
        myScene.hasExitedBudgetingHotspot = hasExitedBudgetingHotspot;
        myScene.hasExitedCreditUniversityHotspot = hasExitedCreditUniversityHotspot;
        myScene.hasExitedCreditScoreCalculatorHotspot = hasExitedCreditScoreCalculatorHotspot;
        myScene.hasExitedAlternativeCreditReportingHotspot = hasExitedAlternativeCreditReportingHotspot;
        myScene.hasExitedCentralCreditUniversityHotspot = hasExitedCentralCreditUniversityHotspot;
        myScene.hasExitedTownHallHotspot = hasExitedTownHallHotspot;
        myScene.hasExitedShopHotspot = hasExitedShopHotspot;
        myScene.hasExitedBistroHotspot = hasExitedBistroHotspot;
        myScene.hasExitedPoliceStationHotspot = hasExitedPoliceStationHotspot;
      }
    });

    return () => {
      gameRef.current.destroy(true);
    };
  }, [setShowBudgetingTool, setIsPlayerInBudgetingHotspot, setShowCreditUniversity, setIsPlayerInCreditUniversityHotspot, setShowCreditScoreCalculator, setIsPlayerInCreditScoreCalculatorHotspot, setShowAlternativeCreditReporting, setIsPlayerInAlternativeCreditReportingHotspot, setShowCentralCreditUniversity, setIsPlayerInCentralCreditUniversityHotspot, setShowTownHall, setIsPlayerInTownHallHotspot, setShowShop, setIsPlayerInShopHotspot, setShowBistro, setIsPlayerInBistroHotspot, setShowPoliceStation, setIsPlayerInPoliceStationHotspot, setHasExitedBudgetingHotspot, setHasExitedCreditUniversityHotspot, setHasExitedCreditScoreCalculatorHotspot, setHasExitedAlternativeCreditReportingHotspot, setHasExitedCentralCreditUniversityHotspot, setHasExitedTownHallHotspot, setHasExitedShopHotspot, setHasExitedBistroHotspot, setHasExitedPoliceStationHotspot, gameRef]);

  return (
    <div>
      <div id="game-container" style={{ width: '100%', height: '100vh' }} />
      {showBudgetingTool && <BudgetingTool onClose={() => { setShowBudgetingTool(false); gameRef.current.scene.getScene('MyScene').setIsPlayerInBudgetingHotspot(false); gameRef.current.scene.getScene('MyScene').showBudgetingTool = false; }} />}
      {showCreditUniversity && <CreditUniversity onClose={() => { setShowCreditUniversity(false); gameRef.current.scene.getScene('MyScene').setIsPlayerInCreditUniversityHotspot(false); gameRef.current.scene.getScene('MyScene').showCreditUniversity = false; }} />}
      {showCreditScoreCalculator && <CreditScoreCalculator onClose={() => { setShowCreditScoreCalculator(false); gameRef.current.scene.getScene('MyScene').setIsPlayerInCreditScoreCalculatorHotspot(false); gameRef.current.scene.getScene('MyScene').showCreditScoreCalculator = false; }} />}
      {showAlternativeCreditReporting && <AlternativeCreditReporting onClose={() => { setShowAlternativeCreditReporting(false); gameRef.current.scene.getScene('MyScene').setIsPlayerInAlternativeCreditReportingHotspot(false); gameRef.current.scene.getScene('MyScene').showAlternativeCreditReporting = false; }} />}
      {showCentralCreditUniversity && <CreditUniversity onClose={() => { setShowCentralCreditUniversity(false); gameRef.current.scene.getScene('MyScene').setIsPlayerInCentralCreditUniversityHotspot(false); gameRef.current.scene.getScene('MyScene').showCentralCreditUniversity = false; }} />}
      {showTownHall && <BudgetingTool onClose={() => { setShowTownHall(false); gameRef.current.scene.getScene('MyScene').setIsPlayerInTownHallHotspot(false); gameRef.current.scene.getScene('MyScene').showTownHall = false; }} />}
      {showShop && <CreditUniversity onClose={() => { setShowShop(false); gameRef.current.scene.getScene('MyScene').setIsPlayerInShopHotspot(false); gameRef.current.scene.getScene('MyScene').showShop = false; }} />}
      {showBistro && <CreditScoreCalculator onClose={() => { setShowBistro(false); gameRef.current.scene.getScene('MyScene').setIsPlayerInBistroHotspot(false); gameRef.current.scene.getScene('MyScene').showBistro = false; }} />}
      {showPoliceStation && <AlternativeCreditReporting onClose={() => { setShowPoliceStation(false); gameRef.current.scene.getScene('MyScene').setIsPlayerInPoliceStationHotspot(false); gameRef.current.scene.getScene('MyScene').showPoliceStation = false; }} />}
    </div>
  );
}

export default Game;
