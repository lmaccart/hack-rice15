import * as Phaser from 'phaser';
import type { Hotspot } from '@/types/game';

const TILE_SIZE = 40;
const PLAYER_SPEED = 60;

export class MainScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };
  private occupiedTiles: Set<string> = new Set();
  private hotspots: Hotspot[] = [];
  private numCols = 0;
  private numRows = 0;

  // React state setters (to be injected)
  public setCurrentHotspotName: (name: string | null) => void = () => {};
  public setActiveOverlay: (overlay: string | null) => void = () => {};
  public setIsChatbotOpen: (open: boolean) => void = () => {};
  public activeOverlay: string | null = null;
  public isChatbotOpen = false;

  constructor() {
    super('MainScene');
  }

  preload() {
    // Load background tiles
    this.load.image('grass', '/img/bkgdArt/Grass.png');
    this.load.image('fence', '/img/bkgdArt/Fence.png');
    this.load.image('fence_vertical', '/img/bkgdArt/fence vertical.png');
    this.load.image('path', '/img/bkgdArt/Path.png');
    this.load.image('tree', '/img/bkgdArt/Tree.png');
    this.load.image('autumnal_tree', '/img/bkgdArt/Autumnal_Tree.png');

    // Load building images
    this.load.image('creditu_front', '/img/storefronts/creditu.png');
    this.load.image('bank_front', '/img/storefronts/bank_front.png');
    this.load.image('townhall_front', '/img/bkgdArt/townhall.png');
    this.load.image('shop_front', '/img/bkgdArt/shop.png');
    this.load.image('bistro_front', '/img/bkgdArt/bistro.png');
    this.load.image('police_station_front', '/img/storefronts/police.png');

    // Load character idle frames
    const directions = ['south', 'west', 'east', 'north', 'south-east', 'north-east', 'north-west', 'south-west'];
    directions.forEach(dir => {
      this.load.image(`${dir}_idle`, `/img/characterSprites/rotations/${dir}.png`);
    });

    // Load character walk animation frames
    const walkDirections = ['north', 'north-east', 'north-west', 'south', 'south-east', 'south-west', 'east', 'west'];
    walkDirections.forEach(dir => {
      for (let i = 0; i < 6; i++) {
        this.load.image(`walk_${dir}_${i}`, `/img/characterSprites/animations/walk/${dir}/frame_00${i}.png`);
      }
    });
  }

  create() {
    this.numCols = Math.floor(this.sys.game.config.width as number / TILE_SIZE);
    this.numRows = Math.floor(this.sys.game.config.height as number / TILE_SIZE);

    this.createMap();
    this.defineHotspots();
    this.drawPaths(); // Draw paths BEFORE marking building tiles occupied
    this.markBuildingTilesOccupied();
    this.drawBuildings();
    this.createTrees();
    this.createPlayer();
    this.setupHotspotPhysics();
  }

  private createMap() {
    // Draw grass background
    for (let y = 0; y < this.numRows; y++) {
      for (let x = 0; x < this.numCols; x++) {
        this.add.image(
          x * TILE_SIZE + TILE_SIZE / 2,
          y * TILE_SIZE + TILE_SIZE / 2,
          'grass'
        ).setDisplaySize(TILE_SIZE, TILE_SIZE);
      }
    }

    // Draw fence borders
    const fences = this.physics.add.staticGroup();
    for (let x = 0; x < this.numCols; x++) {
      fences.create(x * TILE_SIZE + TILE_SIZE / 2, TILE_SIZE / 2, 'fence')
        .setDisplaySize(TILE_SIZE, TILE_SIZE);
      fences.create(
        x * TILE_SIZE + TILE_SIZE / 2,
        (this.numRows - 1) * TILE_SIZE + TILE_SIZE / 2,
        'fence'
      ).setDisplaySize(TILE_SIZE, TILE_SIZE);
    }

    for (let y = 1; y < this.numRows - 1; y++) {
      fences.create(TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2, 'fence_vertical')
        .setDisplaySize(TILE_SIZE, TILE_SIZE);
      fences.create(
        (this.numCols - 1) * TILE_SIZE + TILE_SIZE / 2,
        y * TILE_SIZE + TILE_SIZE / 2,
        'fence_vertical'
      ).setDisplaySize(TILE_SIZE, TILE_SIZE);
    }

    // Mark fence tiles as occupied
    for (let x = 0; x < this.numCols; x++) {
      this.occupiedTiles.add(`${x},0`);
      this.occupiedTiles.add(`${x},${this.numRows - 1}`);
    }
    for (let y = 1; y < this.numRows - 1; y++) {
      this.occupiedTiles.add(`0,${y}`);
      this.occupiedTiles.add(`${this.numCols - 1},${y}`);
    }
  }

  private defineHotspots() {
    this.hotspots = [
      {
        x: 5 * TILE_SIZE + TILE_SIZE / 2,
        y: 4 * TILE_SIZE + TILE_SIZE / 2,
        width: TILE_SIZE * 4,
        height: TILE_SIZE * 4,
        name: 'credituniversity',
        displayName: 'Credit University'
      },
      {
        x: (this.numCols - 5) * TILE_SIZE + TILE_SIZE / 2,
        y: 4 * TILE_SIZE + TILE_SIZE / 2,
        width: TILE_SIZE * 3,
        height: TILE_SIZE * 3,
        name: 'bank',
        displayName: 'Bank'
      },
      {
        x: 9 * TILE_SIZE + TILE_SIZE / 2,
        y: 8 * TILE_SIZE + TILE_SIZE / 2,
        width: TILE_SIZE * 3,
        height: TILE_SIZE * 3,
        name: 'townhall',
        displayName: 'Town Hall'
      },
      {
        x: (this.numCols - 9) * TILE_SIZE + TILE_SIZE / 2,
        y: 8 * TILE_SIZE + TILE_SIZE / 2,
        width: TILE_SIZE * 3,
        height: TILE_SIZE * 3,
        name: 'shop',
        displayName: 'Shop'
      },
      {
        x: (this.numCols - 5) * TILE_SIZE + TILE_SIZE / 2,
        y: 8 * TILE_SIZE + TILE_SIZE / 2,
        width: TILE_SIZE * 3,
        height: TILE_SIZE * 3,
        name: 'bistro',
        displayName: 'Bistro'
      },
      {
        x: (this.numCols / 2) * TILE_SIZE + TILE_SIZE / 2,
        y: (this.numRows - 6) * TILE_SIZE + TILE_SIZE / 2,
        width: TILE_SIZE * 4,
        height: TILE_SIZE * 4,
        name: 'policestation',
        displayName: 'Police Station'
      },
    ];
  }

  private markBuildingTilesOccupied() {
    this.hotspots.forEach(hotspot => {
      const startCol = Math.floor((hotspot.x - hotspot.width / 2) / TILE_SIZE);
      const endCol = Math.floor((hotspot.x + hotspot.width / 2) / TILE_SIZE);
      const startRow = Math.floor((hotspot.y - hotspot.height / 2) / TILE_SIZE);
      const endRow = Math.floor((hotspot.y + hotspot.height / 2) / TILE_SIZE);

      for (let y = startRow; y <= endRow; y++) {
        for (let x = startCol; x <= endCol; x++) {
          this.occupiedTiles.add(`${x},${y}`);
        }
      }
    });
  }

  private drawPaths() {
    const centralVerticalPathX = Math.floor(this.numCols / 2);
    const centralHorizontalPathY = Math.floor(this.numRows / 2) - 1;

    // Draw central vertical path
    this.drawPath(
      centralVerticalPathX * TILE_SIZE + TILE_SIZE / 2,
      TILE_SIZE + TILE_SIZE / 2,
      centralVerticalPathX * TILE_SIZE + TILE_SIZE / 2,
      (this.numRows - 2) * TILE_SIZE + TILE_SIZE / 2
    );

    // Draw central horizontal path
    this.drawPath(
      TILE_SIZE + TILE_SIZE / 2,
      centralHorizontalPathY * TILE_SIZE + TILE_SIZE / 2,
      (this.numCols - 2) * TILE_SIZE + TILE_SIZE / 2,
      centralHorizontalPathY * TILE_SIZE + TILE_SIZE / 2
    );

    // Paths to buildings
    this.hotspots.forEach(hotspot => {
      this.drawPath(
        centralVerticalPathX * TILE_SIZE + TILE_SIZE / 2,
        hotspot.y,
        hotspot.x,
        hotspot.y
      );
    });
  }

  private drawBuildings() {
    const buildingImages = [
      'creditu_front',
      'bank_front',
      'townhall_front',
      'shop_front',
      'bistro_front',
      'police_station_front'
    ];

    this.hotspots.forEach((hotspot, index) => {
      this.add.image(hotspot.x, hotspot.y, buildingImages[index])
        .setDisplaySize(hotspot.width, hotspot.height);
    });
  }

  private createTrees() {
    const numTrees = 100;
    for (let i = 0; i < numTrees; i++) {
      let placed = false;
      while (!placed) {
        const treeCol = Phaser.Math.Between(1, this.numCols - 2);
        const treeRow = Phaser.Math.Between(1, this.numRows - 2);

        if (!this.occupiedTiles.has(`${treeCol},${treeRow}`)) {
          const treeX = treeCol * TILE_SIZE + TILE_SIZE / 2;
          const treeY = treeRow * TILE_SIZE + TILE_SIZE / 2;
          const treeType = Phaser.Math.Between(0, 1) === 0 ? 'tree' : 'autumnal_tree';

          this.add.image(treeX, treeY, treeType).setDisplaySize(TILE_SIZE, TILE_SIZE);
          this.occupiedTiles.add(`${treeCol},${treeRow}`);
          placed = true;
        }
      }
    }
  }

  private createPlayer() {
    const safeSpawnX = (this.numCols / 2) * TILE_SIZE + TILE_SIZE / 2;
    const safeSpawnY = (this.numRows / 2 + 1) * TILE_SIZE + TILE_SIZE / 2;

    this.player = this.physics.add.sprite(safeSpawnX, safeSpawnY, 'south_idle');
    this.player.setCollideWorldBounds(true);

    // Set up camera
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
    this.cameras.main.setZoom(3);

    // Create animations
    const directions = ['south', 'south-west', 'west', 'north-west', 'north', 'north-east', 'east', 'south-east'];
    directions.forEach(dir => {
      this.anims.create({
        key: `walk_${dir}`,
        frames: Array.from({ length: 6 }, (_, i) => ({ key: `walk_${dir}_${i}` })),
        frameRate: 10,
        repeat: -1
      });
    });

    // Set up input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
  }

  private setupHotspotPhysics() {
    this.hotspots.forEach(hotspot => {
      const hotspotSprite = this.physics.add.sprite(hotspot.x, hotspot.y, '')
        .setDisplaySize(hotspot.width, hotspot.height);
      hotspotSprite.setVisible(false);

      // Create a collider for this specific hotspot
      this.physics.add.overlap(
        this.player,
        hotspotSprite,
        () => {
          if (!this.activeOverlay) {
            this.setCurrentHotspotName(hotspot.name);
          }
        },
        undefined,
        this
      );

      // Store custom data on the hotspot sprite to track if player is inside
      (hotspotSprite as any).hotspotName = hotspot.name;
    });
  }

  private drawPath(startX: number, startY: number, endX: number, endY: number) {
    let currentX = Math.floor(startX / TILE_SIZE);
    let currentY = Math.floor(startY / TILE_SIZE);
    const targetX = Math.floor(endX / TILE_SIZE);
    const targetY = Math.floor(endY / TILE_SIZE);

    // Move horizontally first
    while (currentX !== targetX) {
      // Always draw path tiles, even under buildings
      this.add.image(
        currentX * TILE_SIZE + TILE_SIZE / 2,
        currentY * TILE_SIZE + TILE_SIZE / 2,
        'path'
      ).setDisplaySize(TILE_SIZE, TILE_SIZE);
      currentX += currentX < targetX ? 1 : -1;
    }

    // Then move vertically
    while (currentY !== targetY) {
      // Always draw path tiles, even under buildings
      this.add.image(
        currentX * TILE_SIZE + TILE_SIZE / 2,
        currentY * TILE_SIZE + TILE_SIZE / 2,
        'path'
      ).setDisplaySize(TILE_SIZE, TILE_SIZE);
      currentY += currentY < targetY ? 1 : -1;
    }

    // Add final tile
    this.add.image(
      currentX * TILE_SIZE + TILE_SIZE / 2,
      currentY * TILE_SIZE + TILE_SIZE / 2,
      'path'
    ).setDisplaySize(TILE_SIZE, TILE_SIZE);
  }

  update() {
    const isAnyPopupOpen = this.activeOverlay || this.isChatbotOpen;

    if (isAnyPopupOpen) {
      this.player.setVelocity(0);
      this.player.anims.stop();
      if (this.input.keyboard!.enabled) {
        this.input.keyboard!.enabled = false;
      }
      return;
    } else {
      if (!this.input.keyboard!.enabled) {
        this.input.keyboard!.enabled = true;
      }
    }

    // Check if player is still overlapping with any hotspot
    let isInAnyHotspot = false;
    this.hotspots.forEach(hotspot => {
      const dx = this.player.x - hotspot.x;
      const dy = this.player.y - hotspot.y;

      if (Math.abs(dx) < hotspot.width / 2 && Math.abs(dy) < hotspot.height / 2) {
        isInAnyHotspot = true;
      }
    });

    // If player is not in any hotspot, clear the button
    if (!isInAnyHotspot) {
      this.setCurrentHotspotName(null);
    }

    this.player.setVelocity(0);

    if (!this.player || !this.player.anims) {
      return;
    }

    let animationKey = 'walk_south';
    let idleFrameKey = 'south_idle';

    const leftIsDown = this.cursors.left.isDown || this.wasd.left.isDown;
    const rightIsDown = this.cursors.right.isDown || this.wasd.right.isDown;
    const upIsDown = this.cursors.up.isDown || this.wasd.up.isDown;
    const downIsDown = this.cursors.down.isDown || this.wasd.down.isDown;

    if (leftIsDown) {
      this.player.setVelocityX(-PLAYER_SPEED);
      animationKey = 'walk_west';
      idleFrameKey = 'west_idle';
    } else if (rightIsDown) {
      this.player.setVelocityX(PLAYER_SPEED);
      animationKey = 'walk_east';
      idleFrameKey = 'east_idle';
    }

    if (upIsDown) {
      this.player.setVelocityY(-PLAYER_SPEED);
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
      this.player.setVelocityY(PLAYER_SPEED);
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

    if (this.player.body!.velocity.x !== 0 || this.player.body!.velocity.y !== 0) {
      if (this.anims.exists(animationKey)) {
        this.player.anims.play(animationKey, true);
      } else {
        this.player.anims.stop();
        this.player.setTexture(idleFrameKey);
      }
    } else {
      this.player.anims.stop();
      const lastAnimationDirection = this.player.anims.currentAnim
        ? this.player.anims.currentAnim.key.replace('walk_', '')
        : 'south';
      this.player.setTexture(`${lastAnimationDirection}_idle`);
    }
  }
}
