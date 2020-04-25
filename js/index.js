import EthanBedroomScene from "./scenes/ethan-bedroom-scene.js";
import EthanLivingRoomScene from "./scenes/ethan-living-room-scene.js";

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
      gravity: { y: 0 },
      debug: true
    }
  },
  scene: [
    EthanBedroomScene,
    EthanLivingRoomScene
  ]
};

const game = new Phaser.Game(config);
game.scene.start('EthanBedroomScene');
