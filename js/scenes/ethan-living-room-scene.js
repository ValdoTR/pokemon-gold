import Player from "../player.js"

/**
 * A class that extends Phaser.Scene and wraps up the core logic for the platformer level.
 */
export default class EthanLivingRoomScene extends Phaser.Scene {
    constructor() {
        super({
            key: "EthanLivingRoomScene"
        });
    }

    preload() {
        this.load.tilemapTiledJSON("map", "../assets/tilemaps/ethan-house-0.json");
    }

    create() {
        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage("tileset-day", "tiles");

        // Parameters: layer name (or index) from Tiled, tileset, x, y
        this.surfaceLayer = map.createStaticLayer("Surface", tileset, 0, 0);
        this.furnituresLayer = map.createStaticLayer("Furnitures", tileset, 0, 0);

        // Instantiate a player instance at the location of the "Spawn Point" object in the Tiled map.
        // Note: instead of storing the player in a global variable, it's stored as a property of the
        // scene.
        const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");
        this.player = new Player(this, spawnPoint.x, spawnPoint.y);

        this.surfaceLayer.setCollisionByProperty({ collides: true });
        this.furnituresLayer.setCollisionByProperty({ collides: true });
        this.physics.world.addCollider(this.player.sprite, this.surfaceLayer);
        this.physics.world.addCollider(this.player.sprite, this.furnituresLayer);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player.sprite);
        this.cameras.main.roundPixels = true; // fixes gaps bug
    }

    update(time, delta) {
        // Allow the player to respond to key presses and move itself
        this.player.update();
    }
}
