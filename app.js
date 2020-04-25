const config = {
  type: Phaser.AUTO,
  // screen resolution of the original Game Boy
  width: 160,
  height: 144,
  zoom: 3,
  parent: "game-container",
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 } // Top down game, so no gravity
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);
let cursors;
let player;

function preload() {
  this.load.image("tiles", "./assets/tileset-day.png");
  this.load.tilemapTiledJSON("map", "./assets/ethan-house.json");
  this.load.atlas("ethan-atlas", "./assets/ethan-atlas.png", "./assets/ethan-atlas.json");
}

function create() {
  const map = this.make.tilemap({ key: "map" });

  // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
  // Phaser's cache (i.e. the name you used in preload)
  const tileset = map.addTilesetImage("tileset-day", "tiles");

  // Parameters: layer name (or index) from Tiled, tileset, x, y
  const belowLayer = map.createStaticLayer("Below Player", tileset, 0, 0);
  const worldLayer = map.createStaticLayer("World", tileset, 0, 0);

  worldLayer.setCollisionByProperty({ collides: true });

  const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");
  player = this.physics.add
      .sprite(spawnPoint.x, spawnPoint.y, "ethan-atlas", "ethan-front");
  this.physics.add.collider(player, worldLayer);

  const anims = this.anims;
  anims.create({
    key: "ethan-left-walk",
    frames: anims.generateFrameNames("ethan-atlas", { prefix: "ethan-left-walk.", start: 0, end: 3, zeroPad: 3 }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: "ethan-right-walk",
    frames: anims.generateFrameNames("ethan-atlas", { prefix: "ethan-right-walk.", start: 0, end: 3, zeroPad: 3 }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: "ethan-front-walk",
    frames: anims.generateFrameNames("ethan-atlas", { prefix: "ethan-front-walk.", start: 0, end: 3, zeroPad: 3 }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: "ethan-back-walk",
    frames: anims.generateFrameNames("ethan-atlas", { prefix: "ethan-back-walk.", start: 0, end: 3, zeroPad: 3 }),
    frameRate: 10,
    repeat: -1
  });

  // Phaser supports multiple cameras, but you can access the default camera like this:
  const camera = this.cameras.main;
  camera.startFollow(player);
  camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

  cursors = this.input.keyboard.createCursorKeys();
}

function update(time, delta) {
  const speed = 50;
  const prevVelocity = player.body.velocity.clone();

  // Stop any previous movement from the last frame
  player.body.setVelocity(0);

  // Horizontal movement
  if (cursors.left.isDown) {
    player.body.setVelocityX(-speed);
  } else if (cursors.right.isDown) {
    player.body.setVelocityX(speed);
  }

  // Vertical movement
  if (cursors.up.isDown) {
    player.body.setVelocityY(-speed);
  } else if (cursors.down.isDown) {
    player.body.setVelocityY(speed);
  }

  // Normalize and scale the velocity so that player can't move faster along a diagonal
  player.body.velocity.normalize().scale(speed);

  // Update the animation last and give left/right animations precedence over up/down animations
  if (cursors.left.isDown) {
    player.anims.play("ethan-left-walk", true);
  } else if (cursors.right.isDown) {
    player.anims.play("ethan-right-walk", true);
  } else if (cursors.up.isDown) {
    player.anims.play("ethan-back-walk", true);
  } else if (cursors.down.isDown) {
    player.anims.play("ethan-front-walk", true);
  } else {
    player.anims.stop();

    // If we were moving, pick and idle frame to use
    if (prevVelocity.x < 0) player.setTexture("ethan-atlas", "ethan-left");
    else if (prevVelocity.x > 0) player.setTexture("ethan-atlas", "ethan-right");
    else if (prevVelocity.y < 0) player.setTexture("ethan-atlas", "ethan-back");
    else if (prevVelocity.y > 0) player.setTexture("ethan-atlas", "ethan-front");
  }
}
