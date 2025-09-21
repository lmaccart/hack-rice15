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
    this.setShowCreditUniversity = () => {};
    this.setShowCreditScoreCalculator = () => {};
    this.setShowAlternativeCreditReporting = () => {};
    this.setShowCentralCreditUniversity = () => {};
    this.setShowTownHall = () => {};
    this.setShowShop = () => {};
    this.setShowBistro = () => {};
    this.setShowPoliceStation = () => {};
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
    this.hasExitedCentralCreditUniversity = true; // New property for cooldown
    this.hasExitedTownHallHotspot = true; // New property for cooldown
    this.hasExitedShopHotspot = true; // New property for cooldown
    this.hasExitedBistroHotspot = true; // New property for cooldown
    this.hasExitedPoliceStationHotspot = true; // New property for cooldown
    this.isPlayerInBudgetingHotspot = false; // Internal state for MyScene
    this.isPlayerInCreditUniversityHotspot = false; // Internal state for MyScene
    this.isPlayerInCreditScoreCalculatorHotspot = false; // Internal state for MyScene
    this.isPlayerInAlternativeCreditReportingHotspot = false; // Internal state for MyScene
    this.isPlayerInCentralCreditUniversityHotspot = false; // Internal state for MyScene
    this.isPlayerInTownHallHotspot = false; // Internal state for MyScene
    this.isPlayerInShopHotspot = false; // Internal state for MyScene
    this.isPlayerInBistroHotspot = false; // Internal state for MyScene
    this.isPlayerInPoliceStationHotspot = false; // Internal state for MyScene
    this.currentHotspotName = null; // New property to store the name of the current hotspot
    this.setCurrentHotspotName = () => {}; // Setter for currentHotspotName from React

  }

  preload() {
    this.load.image('grass', 'img/bkgdArt/Grass.png');
    this.load.image('fence', 'img/bkgdArt/Fence.png');
    this.load.image('fence_vertical', 'img/bkgdArt/fence vertical.png');
    this.load.image('path', 'img/bkgdArt/Path.png');
    this.load.image('tree', 'img/bkgdArt/Tree.png');
    this.load.image('autumnal_tree', 'img/bkgdArt/Autumnal_Tree.png');
    this.load.image('creditu_front', 'img/storefronts/creditu.png');
    this.load.image('bank_front', 'img/storefronts/bank_front.png');
    this.load.image('townhall_front', 'img/bkgdArt/townhall.png');
    this.load.image('shop_front', 'img/bkgdArt/shop.png');
    this.load.image('bistro_front', 'img/bkgdArt/bistro.png');
    this.load.image('police_station_front', 'img/storefronts/police.png');

    // Load character rotation (idle) images
    this.load.image('south_idle', 'img/characterSprites/rotations/south.png');
    this.load.image('west_idle', 'img/characterSprites/rotations/west.png');
    this.load.image('east_idle', 'img/characterSprites/rotations/east.png');
    this.load.image('north_idle', 'img/characterSprites/rotations/north.png');
    this.load.image('south-east_idle', 'img/characterSprites/rotations/south-east.png');
    this.load.image('north-east_idle', 'img/characterSprites/rotations/north-east.png');
    this.load.image('north-west_idle', 'img/characterSprites/rotations/north-west.png');
    this.load.image('south-west_idle', 'img/characterSprites/rotations/south-west.png');

    // Load character walk animation frames
    const directions = ['north', 'north-east', 'north-west', 'south', 'south-east', 'south-west', 'east', 'west'];
    directions.forEach(dir => {
      for (let i = 0; i < 6; i++) {
        this.load.image(`walk_${dir}_${i}`, `img/characterSprites/animations/walk/${dir}/frame_00${i}.png`);
      }
    });
  }

  create() {
    this.numCols = Math.floor(this.sys.game.config.width / tileSize);
    this.numRows = Math.floor(this.sys.game.config.height / tileSize);

    this._createMap();
    this._defineHotspots();
    this._markBuildingTilesOccupied();
    this._drawPaths();
    this._drawBuildings();
    this._createTrees();
    this._createPlayer();
    this._setupHotspotPhysics();
  }

  _createMap() {
    // Draw grass background (across entire grid first)
    for (let y = 0; y < this.numRows; y++) {
      for (let x = 0; x < this.numCols; x++) {
        this.add.image(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2, 'grass').setDisplaySize(tileSize, tileSize);
      }
    }

    // Draw fence borders
    this.fences = this.physics.add.staticGroup();
    for (let x = 0; x < this.numCols; x++) {
      this.fences.create(x * tileSize + tileSize / 2, tileSize / 2, 'fence').setDisplaySize(tileSize, tileSize);
      this.fences.create(x * tileSize + tileSize / 2, (this.numRows - 1) * tileSize + tileSize / 2, 'fence').setDisplaySize(tileSize, tileSize);
    }
    for (let y = 1; y < this.numRows - 1; y++) {
      this.fences.create(tileSize / 2, y * tileSize + tileSize / 2, 'fence_vertical').setDisplaySize(tileSize, tileSize);
      this.fences.create((this.numCols - 1) * tileSize + tileSize / 2, y * tileSize + tileSize / 2, 'fence_vertical').setDisplaySize(tileSize, tileSize);
    }

    // Mark fence tiles as occupied (after drawing them)
    for (let x = 0; x < this.numCols; x++) {
      this.occupiedTiles.add(`${x},0`);
      this.occupiedTiles.add(`${x},${this.numRows - 1}`);
    }
    for (let y = 1; y < this.numRows - 1; y++) {
      this.occupiedTiles.add(`0,${y}`);
      this.occupiedTiles.add(`${this.numCols - 1},${y}`);
    }
  }

  _defineHotspots() {
    // Define hotspot regions
    this.hotspots = [
      { x: 5 * tileSize + tileSize / 2, y: 4 * tileSize + tileSize / 2, width: tileSize * 4, height: tileSize * 4, name: 'credituniversity' }, // Top-left Credit University
      { x: (this.numCols - 5) * tileSize + tileSize / 2, y: 4 * tileSize + tileSize / 2, width: tileSize * 3, height: tileSize * 3, name: 'bank' }, // Top-right Bank (shrunk)
      { x: 9 * tileSize + tileSize / 2, y: 8 * tileSize + tileSize / 2, width: tileSize * 3, height: tileSize * 3, name: 'townhall' }, // Center-left Town Hall
      { x: (this.numCols - 9) * tileSize + tileSize / 2, y: 8 * tileSize + tileSize / 2, width: tileSize * 3, height: tileSize * 3, name: 'shop' }, // Center-right Shop
      { x: (this.numCols - 5) * tileSize + tileSize / 2, y: 8 * tileSize + tileSize / 2, width: tileSize * 3, height: tileSize * 3, name: 'bistro' }, // Center-right Bistro
      { x: this.numCols / 2 * tileSize + tileSize / 2, y: (this.numRows - 6) * tileSize + tileSize / 2, width: tileSize * 4, height: tileSize * 4, name: 'policestation' }, // Bottom-center Police Station
    ];
  }

  _markBuildingTilesOccupied() {
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
  }

  _drawPaths() {
    // Define central paths
    const centralVerticalPathX = Math.floor(this.numCols / 2);
    const centralHorizontalPathY = Math.floor(this.numRows / 2) - 1; // Adjusted for the overall shift of the map

    // Draw central vertical path
    this.drawPath(centralVerticalPathX * tileSize + tileSize / 2, tileSize + tileSize / 2, centralVerticalPathX * tileSize + tileSize / 2, (this.numRows - 2) * tileSize + tileSize / 2, {});

    // Draw central horizontal path
    this.drawPath(tileSize + tileSize / 2, centralHorizontalPathY * tileSize + tileSize / 2, (this.numCols - 2) * tileSize + tileSize / 2, centralHorizontalPathY * tileSize + tileSize / 2, {});

    // Paths to buildings
    // Credit University (top-left)
    this.drawPath(centralVerticalPathX * tileSize + tileSize / 2, 4 * tileSize + tileSize / 2, 5 * tileSize + tileSize / 2, 4 * tileSize + tileSize / 2, {});

    // Bank (top-right)
    this.drawPath(centralVerticalPathX * tileSize + tileSize / 2, 4 * tileSize + tileSize / 2, (this.numCols - 5) * tileSize + tileSize / 2, 4 * tileSize + tileSize / 2, {});

    // Town Hall (center-left)
    this.drawPath(centralVerticalPathX * tileSize + tileSize / 2, 8 * tileSize + tileSize / 2, 9 * tileSize + tileSize / 2, 8 * tileSize + tileSize / 2, {});

    // Shop (center-right, from central horizontal path)
    this.drawPath(centralVerticalPathX * tileSize + tileSize / 2, 8 * tileSize + tileSize / 2, (this.numCols - 9) * tileSize + tileSize / 2, 8 * tileSize + tileSize / 2, {});

    // Bistro (next to shop)
    this.drawPath((this.numCols - 9) * tileSize + tileSize / 2, 8 * tileSize + tileSize / 2, (this.numCols - 5) * tileSize + tileSize / 2, 8 * tileSize + tileSize / 2, {});

    // Police Station (bottom-center)
    this.drawPath(centralVerticalPathX * tileSize + tileSize / 2, (this.numRows - 6) * tileSize + tileSize / 2, centralVerticalPathX * tileSize + tileSize / 2, (this.numRows - 6) * tileSize + tileSize / 2, {});
  }

  _drawBuildings() {
    // Draw buildings/hotspots
    this.add.image(this.hotspots[0].x, this.hotspots[0].y, 'creditu_front').setDisplaySize(this.hotspots[0].width, this.hotspots[0].height); // Credit University
    this.add.image(this.hotspots[1].x, this.hotspots[1].y, 'bank_front').setDisplaySize(this.hotspots[1].width, this.hotspots[1].height); // Bank
    this.add.image(this.hotspots[2].x, this.hotspots[2].y, 'townhall_front').setDisplaySize(this.hotspots[2].width, this.hotspots[2].height); // Town Hall
    this.add.image(this.hotspots[3].x, this.hotspots[3].y, 'shop_front').setDisplaySize(this.hotspots[3].width, this.hotspots[3].height); // Shop
    this.add.image(this.hotspots[4].x, this.hotspots[4].y, 'bistro_front').setDisplaySize(this.hotspots[4].width, this.hotspots[4].height); // Bistro
    this.add.image(this.hotspots[5].x, this.hotspots[5].y, 'police_station_front').setDisplaySize(this.hotspots[5].width, this.hotspots[5].height); // Police Station
  }

  _createTrees() {
    const numTrees = 100; // adjust as needed (increased from 50)
    for (let i = 0; i < numTrees; i++) {
      let treeX, treeY, treeCol, treeRow;
      let placed = false;
      while (!placed) {
        treeCol = Phaser.Math.Between(1, this.numCols - 2); // avoid borders
        treeRow = Phaser.Math.Between(1, this.numRows - 2); // avoid borders
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
  }

  _createPlayer() {
    // Calculate a safe spawn position
    // Spawn player near the center of the map
    let safeSpawnX = this.numCols / 2 * tileSize + tileSize / 2;
    let safeSpawnY = (this.numRows / 2 + 1) * tileSize + tileSize / 2; // Adjusted for the overall shift of the map

    this.player = this.physics.add.sprite(safeSpawnX, safeSpawnY, 'south_idle');
    this.player.setCollideWorldBounds(true);

    // Set up camera to follow the player
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
    this.cameras.main.setZoom(3); // Adjust zoom level as needed

    // Create animations from individual frames
    this.anims.create({
      key: 'walk_south',
      frames: [
        { key: 'walk_south_0' }, { key: 'walk_south_1' }, { key: 'walk_south_2' },
        { key: 'walk_south_3' }, { key: 'walk_south_4' }, { key: 'walk_south_5' }
      ],
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'walk_south-west',
      frames: [
        { key: 'walk_south-west_0' }, { key: 'walk_south-west_1' }, { key: 'walk_south-west_2' },
        { key: 'walk_south-west_3' }, { key: 'walk_south-west_4' }, { key: 'walk_south-west_5' }
      ],
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'walk_west',
      frames: [
        { key: 'walk_west_0' }, { key: 'walk_west_1' }, { key: 'walk_west_2' },
        { key: 'walk_west_3' }, { key: 'walk_west_4' }, { key: 'walk_west_5' }
      ],
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'walk_north-west',
      frames: [
        { key: 'walk_north-west_0' }, { key: 'walk_north-west_1' }, { key: 'walk_north-west_2' },
        { key: 'walk_north-west_3' }, { key: 'walk_north-west_4' }, { key: 'walk_north-west_5' }
      ],
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'walk_north',
      frames: [
        { key: 'walk_north_0' }, { key: 'walk_north_1' }, { key: 'walk_north_2' },
        { key: 'walk_north_3' }, { key: 'walk_north_4' }, { key: 'walk_north_5' }
      ],
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'walk_north-east',
      frames: [
        { key: 'walk_north-east_0' }, { key: 'walk_north-east_1' }, { key: 'walk_north-east_2' },
        { key: 'walk_north-east_3' }, { key: 'walk_north-east_4' }, { key: 'walk_north-east_5' }
      ],
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'walk_east',
      frames: [
        { key: 'walk_east_0' }, { key: 'walk_east_1' }, { key: 'walk_east_2' },
        { key: 'walk_east_3' }, { key: 'walk_east_4' }, { key: 'walk_east_5' }
      ],
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'walk_south-east',
      frames: [
        { key: 'walk_south-east_0' }, { key: 'walk_south-east_1' }, { key: 'walk_south-east_2' },
        { key: 'walk_south-east_3' }, { key: 'walk_south-east_4' }, { key: 'walk_south-east_5' }
      ],
      frameRate: 10,
      repeat: -1
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
  }

  _setupHotspotPhysics() {
    // Hotspot for Credit University (hotspots[0])
    const creditUniversityHotspot = this.physics.add.sprite(this.hotspots[0].x, this.hotspots[0].y, null).setDisplaySize(this.hotspots[0].width, this.hotspots[0].height);
    creditUniversityHotspot.setVisible(false);
    this.physics.add.overlap(this.player, creditUniversityHotspot, () => {
      if (this.hasExitedCreditUniversityHotspot && !this.showBudgetingTool && !this.showCreditScoreCalculator && !this.showAlternativeCreditReporting && !this.showCentralCreditUniversity && !this.showTownHall && !this.showShop && !this.showBistro && !this.showPoliceStation) {
        this.setCurrentHotspotName('credituniversity');
        this.isPlayerInCreditUniversityHotspot = true;
        this.setHasExitedCreditUniversityHotspot(false);
      }
    });
    this.physics.world.on('overlapend', (gameObject1, gameObject2, body1, body2) => {
      if (gameObject1 === this.player && gameObject2 === creditUniversityHotspot) {
        this.setCurrentHotspotName(null);
        this.isPlayerInCreditUniversityHotspot = false;
        this.setHasExitedCreditUniversityHotspot(true);
      }
    });

    // Hotspot for Bank (hotspots[1]) - using CreditScoreCalculator for now
    const bankHotspot = this.physics.add.sprite(this.hotspots[1].x, this.hotspots[1].y, null).setDisplaySize(this.hotspots[1].width, this.hotspots[1].height);
    bankHotspot.setVisible(false);
    this.physics.add.overlap(this.player, bankHotspot, () => {
      if (this.hasExitedBudgetingHotspot && !this.showCreditUniversity && !this.showCreditScoreCalculator && !this.showAlternativeCreditReporting && !this.showCentralCreditUniversity && !this.showTownHall && !this.showShop && !this.showBistro && !this.showPoliceStation) {
        this.setCurrentHotspotName('bank');
        this.isPlayerInBudgetingHotspot = true;
        this.setHasExitedBudgetingHotspot(false);
      }
    });
    this.physics.world.on('overlapend', (gameObject1, gameObject2, body1, body2) => {
      if (gameObject1 === this.player && gameObject2 === bankHotspot) {
        this.setCurrentHotspotName(null);
        this.isPlayerInBudgetingHotspot = false;
        this.setHasExitedBudgetingHotspot(true);
      }
    });

    // Hotspot for Town Hall (hotspots[2])
    const townHallHotspot = this.physics.add.sprite(this.hotspots[2].x, this.hotspots[2].y, null).setDisplaySize(this.hotspots[2].width, this.hotspots[2].height);
    townHallHotspot.setVisible(false);
    this.physics.add.overlap(this.player, townHallHotspot, () => {
      if (this.hasExitedTownHallHotspot && !this.showBudgetingTool && !this.showCreditUniversity && !this.showCreditScoreCalculator && !this.showAlternativeCreditReporting && !this.showCentralCreditUniversity && !this.showShop && !this.showBistro && !this.showPoliceStation) {
        this.setCurrentHotspotName('townhall');
        this.isPlayerInTownHallHotspot = true;
        this.setHasExitedTownHallHotspot(false);
      }
    });
    this.physics.world.on('overlapend', (gameObject1, gameObject2, body1, body2) => {
      if (gameObject1 === this.player && gameObject2 === townHallHotspot) {
        this.setCurrentHotspotName(null);
        this.isPlayerInTownHallHotspot = false;
        this.setHasExitedTownHallHotspot(true);
      }
    });

    // Hotspot for Shop (hotspots[3]) - using CreditUniversity for now
    const shopHotspot = this.physics.add.sprite(this.hotspots[3].x, this.hotspots[3].y, null).setDisplaySize(this.hotspots[3].width, this.hotspots[3].height);
    shopHotspot.setVisible(false);
    this.physics.add.overlap(this.player, shopHotspot, () => {
      if (this.hasExitedShopHotspot && !this.showBudgetingTool && !this.showCreditUniversity && !this.showCreditScoreCalculator && !this.showAlternativeCreditReporting && !this.showCentralCreditUniversity && !this.showTownHall && !this.showBistro && !this.showPoliceStation) {
        this.setCurrentHotspotName('shop');
        this.isPlayerInShopHotspot = true;
        this.setHasExitedShopHotspot(false);
      }
    });
    this.physics.world.on('overlapend', (gameObject1, gameObject2, body1, body2) => {
      if (gameObject1 === this.player && gameObject2 === shopHotspot) {
        this.setCurrentHotspotName(null);
        this.isPlayerInShopHotspot = false;
        this.setHasExitedShopHotspot(true);
      }
    });

    // Hotspot for Bistro (hotspots[4]) - using AlternativeCreditReporting for now
    const bistroHotspot = this.physics.add.sprite(this.hotspots[4].x, this.hotspots[4].y, null).setDisplaySize(this.hotspots[4].width, this.hotspots[4].height);
    bistroHotspot.setVisible(false);
    this.physics.add.overlap(this.player, bistroHotspot, () => {
      if (this.hasExitedBistroHotspot && !this.showBudgetingTool && !this.showCreditUniversity && !this.showCreditScoreCalculator && !this.showAlternativeCreditReporting && !this.showCentralCreditUniversity && !this.showTownHall && !this.showShop && !this.showPoliceStation) {
        this.setCurrentHotspotName('bistro');
        this.isPlayerInBistroHotspot = true;
        this.setHasExitedBistroHotspot(false);
      }
    });
    this.physics.world.on('overlapend', (gameObject1, gameObject2, body1, body2) => {
      if (gameObject1 === this.player && gameObject2 === bistroHotspot) {
        this.setCurrentHotspotName(null);
        this.isPlayerInBistroHotspot = false;
        this.setHasExitedBistroHotspot(true);
      }
    });

    // Hotspot for Police Station (hotspots[5])
    const policeStationHotspot = this.physics.add.sprite(this.hotspots[5].x, this.hotspots[5].y, null).setDisplaySize(this.hotspots[5].width, this.hotspots[5].height);
    policeStationHotspot.setVisible(false);
    this.physics.add.overlap(this.player, policeStationHotspot, () => {
      if (this.hasExitedPoliceStationHotspot && !this.showBudgetingTool && !this.showCreditUniversity && !this.showCreditScoreCalculator && !this.showAlternativeCreditReporting && !this.showCentralCreditUniversity && !this.showTownHall && !this.showShop && !this.showBistro) {
        this.setCurrentHotspotName('policestation');
        this.isPlayerInPoliceStationHotspot = true;
        this.setHasExitedPoliceStationHotspot(false);
      }
    });
    this.physics.world.on('overlapend', (gameObject1, gameObject2, body1, body2) => {
      if (gameObject1 === this.player && gameObject2 === policeStationHotspot) {
        this.setCurrentHotspotName(null);
        this.isPlayerInPoliceStationHotspot = false;
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

    if (!this.player || !this.player.anims) {
      return; // Exit if player or animations are not ready
    }

    let animationKey = this.player.anims.currentAnim ? this.player.anims.currentAnim.key : 'walk_south'; // Default to south if no animation is playing
    let idleFrameKey = 'south_idle'; // Default idle frame

    const leftIsDown = this.cursors.left.isDown || this.wasd.left.isDown;
    const rightIsDown = this.cursors.right.isDown || this.wasd.right.isDown;
    const upIsDown = this.cursors.up.isDown || this.wasd.up.isDown;
    const downIsDown = this.cursors.down.isDown || this.wasd.down.isDown;

    const playerSpeed = 160;

    if (leftIsDown) {
      this.player.setVelocityX(-playerSpeed);
      animationKey = 'walk_west';
      idleFrameKey = 'west_idle';
    } else if (rightIsDown) {
      this.player.setVelocityX(playerSpeed);
      animationKey = 'walk_east';
      idleFrameKey = 'east_idle';
    }

    if (upIsDown) {
      this.player.setVelocityY(-playerSpeed);
      if (leftIsDown) {
        animationKey = 'walk_north-west';
        idleFrameKey = 'north-west_idle';
      } else if (rightIsDown) {
        animationKey = 'walk_north-east';
        idleFrameKey = 'north-east_idle';
      } else {
        animationKey = 'walk_north';
        idleFrameKey = 'north_idle';
      }
    } else if (downIsDown) {
      this.player.setVelocityY(playerSpeed);
      if (leftIsDown) {
        animationKey = 'walk_south-west';
        idleFrameKey = 'south-west_idle';
      } else if (rightIsDown) {
        animationKey = 'walk_south-east';
        idleFrameKey = 'south-east_idle';
      } else {
        animationKey = 'walk_south';
        idleFrameKey = 'south_idle';
      }
    }

    if (this.player.body.velocity.x !== 0 || this.player.body.velocity.y !== 0) {
      if (this.anims.exists(animationKey)) {
        this.player.anims.play(animationKey, true);
      } else {
        console.warn(`Animation key "${animationKey}" does not exist.`);
        this.player.anims.stop();
        this.player.setTexture(idleFrameKey); // Default to idle frame
      }
    } else {
      this.player.anims.stop();
      // Set to the last frame of the last played animation when idle
      const lastAnimationDirection = this.player.anims.currentAnim ? this.player.anims.currentAnim.key.replace('walk_', '') : 'south';
      this.player.setTexture(`${lastAnimationDirection}_idle`);
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

  // New state variables for popup cooldown
  const [hasExitedBudgetingHotspot, setHasExitedBudgetingHotspot] = useState(true);
  const [hasExitedCreditUniversityHotspot, setHasExitedCreditUniversityHotspot] = useState(true);
  const [hasExitedCreditScoreCalculatorHotspot, setHasExitedCreditScoreCalculatorHotspot] = useState(true);
  const [hasExitedAlternativeCreditReporting, setHasExitedAlternativeCreditReporting] = useState(true); // DO NOT CHANGE THIS LINE
  const [hasExitedCentralCreditUniversity, setHasExitedCentralCreditUniversity] = useState(true);
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
        myScene.setShowCreditUniversity = setShowCreditUniversity;
        myScene.setShowCreditScoreCalculator = setShowCreditScoreCalculator;
        myScene.setShowAlternativeCreditReporting = setShowAlternativeCreditReporting;
        myScene.setShowCentralCreditUniversity = setShowCentralCreditUniversity;
        myScene.setShowTownHall = setShowTownHall;
        myScene.setShowShop = setShowShop;
        myScene.setShowBistro = setShowBistro;
        myScene.setShowPoliceStation = setShowPoliceStation;

        // Expose React state setters for cooldown
        myScene.setHasExitedBudgetingHotspot = setHasExitedBudgetingHotspot;
        myScene.setHasExitedCreditUniversityHotspot = setHasExitedCreditUniversityHotspot;
        myScene.setHasExitedCreditScoreCalculatorHotspot = setHasExitedCreditScoreCalculatorHotspot;
        myScene.setHasExitedAlternativeCreditReportingHotspot = setHasExitedAlternativeCreditReporting;
        myScene.setHasExitedCentralCreditUniversity = setHasExitedCentralCreditUniversity;
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
        myScene.hasExitedAlternativeCreditReportingHotspot = hasExitedAlternativeCreditReporting;
        myScene.hasExitedCentralCreditUniversity = hasExitedCentralCreditUniversity;
        myScene.hasExitedTownHallHotspot = hasExitedTownHallHotspot;
        myScene.hasExitedShopHotspot = hasExitedShopHotspot;
        myScene.hasExitedBistroHotspot = hasExitedBistroHotspot;
        myScene.hasExitedPoliceStationHotspot = hasExitedPoliceStationHotspot;
      }
    });

    return () => {
      gameRef.current.destroy(true);
    };
  }, [setShowBudgetingTool, setShowCreditUniversity, setShowCreditScoreCalculator, setShowAlternativeCreditReporting, setShowCentralCreditUniversity, setShowTownHall, setShowShop, setShowBistro, setShowPoliceStation, setHasExitedBudgetingHotspot, setHasExitedCreditUniversityHotspot, setHasExitedCreditScoreCalculatorHotspot, setHasExitedAlternativeCreditReporting, setHasExitedCentralCreditUniversity, setHasExitedTownHallHotspot, setHasExitedShopHotspot, setHasExitedBistroHotspot, setHasExitedPoliceStationHotspot, hasExitedAlternativeCreditReporting, hasExitedBistroHotspot, hasExitedBudgetingHotspot, hasExitedCentralCreditUniversity, hasExitedCreditScoreCalculatorHotspot, hasExitedCreditUniversityHotspot, hasExitedPoliceStationHotspot, hasExitedShopHotspot, hasExitedTownHallHotspot, showBistro, showCentralCreditUniversity, showPoliceStation, showShop, showTownHall, gameRef]);

  return (
    <div>
      <div id="game-container" style={{ width: '100%', height: '100vh' }} />
      {showBudgetingTool && <BudgetingTool onClose={() => { setShowBudgetingTool(false); gameRef.current.scene.getScene('MyScene').showBudgetingTool = false; }} />}
      {showCreditUniversity && <CreditUniversity onClose={() => { setShowCreditUniversity(false); gameRef.current.scene.getScene('MyScene').showCreditUniversity = false; }} />}
      {showCreditScoreCalculator && <CreditScoreCalculator onClose={() => { setShowCreditScoreCalculator(false); gameRef.current.scene.getScene('MyScene').showCreditScoreCalculator = false; }} />}
      {showAlternativeCreditReporting && <AlternativeCreditReporting onClose={() => { setShowAlternativeCreditReporting(false); gameRef.current.scene.getScene('MyScene').showAlternativeCreditReporting = false; }} />}
      {showCentralCreditUniversity && <CreditUniversity onClose={() => { setShowCentralCreditUniversity(false); gameRef.current.scene.getScene('MyScene').showCentralCreditUniversity = false; }} />}
      {showTownHall && <BudgetingTool onClose={() => { setShowTownHall(false); gameRef.current.scene.getScene('MyScene').showTownHall = false; }} />}
      {showShop && <CreditUniversity onClose={() => { setShowShop(false); gameRef.current.scene.getScene('MyScene').showShop = false; }} />}
      {showBistro && <CreditScoreCalculator onClose={() => { setShowBistro(false); gameRef.current.scene.getScene('MyScene').showBistro = false; }} />}
      {showPoliceStation && <AlternativeCreditReporting onClose={() => { setShowPoliceStation(false); gameRef.current.scene.getScene('MyScene').showPoliceStation = false; }} />}
    </div>
  );
}

export default Game;
