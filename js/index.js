import PlatformerScene from "./platformer-scene.js";

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
  scene: PlatformerScene
};

const game = new Phaser.Game(config);
