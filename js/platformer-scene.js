import Player from "./player.js"

/**
 * A class that extends Phaser.Scene and wraps up the core logic for the platformer level.
 */
export default class PlatformerScene extends Phaser.Scene {
    preload() {
        this.load.image("tiles", "../assets/tilesets/tileset-day.png");
        this.load.tilemapTiledJSON("map", "../assets/tilemaps/ethan-house.json");
        this.load.atlas("player", "../assets/spritesheets/ethan.png", "../assets/spritesheets/ethan.json");
    }

    create() {
        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage("tileset-day", "tiles");

        // Parameters: layer name (or index) from Tiled, tileset, x, y
        map.createStaticLayer("Below Player", tileset, 0, 0);
        this.worldLayer = map.createStaticLayer("World", tileset, 0, 0);

        // Instantiate a player instance at the location of the "Spawn Point" object in the Tiled map.
        // Note: instead of storing the player in a global variable, it's stored as a property of the
        // scene.
        const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");
        this.player = new Player(this, spawnPoint.x, spawnPoint.y);

        this.worldLayer.setCollisionByProperty({ collides: true });
        this.physics.world.addCollider(this.player.sprite, this.worldLayer);

        this.cameras.main.startFollow(this.player.sprite);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    }

    update(time, delta) {
        // Allow the player to respond to key presses and move itself
        this.player.update();
    }
}
