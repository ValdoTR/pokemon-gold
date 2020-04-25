import Player from "../player.js"

/**
 * A class that extends Phaser.Scene and wraps up the core logic for the platformer level.
 */
export default class EthanBedroomScene extends Phaser.Scene {
    constructor() {
        super({
            key: "EthanBedroomScene"
        });
    }

    preload() {
        this.load.image("tiles", "../assets/tilesets/tileset-day.png");
        this.load.tilemapTiledJSON("map", "../assets/tilemaps/ethan-house-1.json");
        this.load.atlas("player", "../assets/spritesheets/ethan.png", "../assets/spritesheets/ethan.json");
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

        this.passageToLivingRoom = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
        let xCoord = 136; // center of last tile (downstairs tile)
        let yCoord = 0; // top
        let passageWidth = 16; // tile width
        let passageHeight = 1; // top pixel line tile
        this.passageToLivingRoom.create(xCoord, yCoord, passageWidth, passageHeight);
        this.physics.add.overlap(this.player.sprite, this.passageToLivingRoom, this.onSceneSwitch, false, this);
    }

    update(time, delta) {
        // Allow the player to respond to key presses and move itself
        this.player.update();
    }

    onSceneSwitch(player, zone) {
        const duration = 200;
        this.cameras.main.fade(duration);
    }
}
