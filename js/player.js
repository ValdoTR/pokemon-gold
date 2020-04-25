/**
 * A class that wraps up our 2D platforming player logic. It creates, animates and moves a sprite in
 * response to WASD/arrow keys. Call its update method from the scene's update
 */
export default class Player {
    constructor(scene, x, y) {
        this.scene = scene;

        // Create the animations we need from the player spritesheet
        const anims = scene.anims;
        anims.create({
            key: "ethan-left-walk",
            frames: anims.generateFrameNames("player", { prefix: "ethan-left-walk.", start: 0, end: 3, zeroPad: 3 }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: "ethan-right-walk",
            frames: anims.generateFrameNames("player", { prefix: "ethan-right-walk.", start: 0, end: 3, zeroPad: 3 }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: "ethan-front-walk",
            frames: anims.generateFrameNames("player", { prefix: "ethan-front-walk.", start: 0, end: 3, zeroPad: 3 }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: "ethan-back-walk",
            frames: anims.generateFrameNames("player", { prefix: "ethan-back-walk.", start: 0, end: 3, zeroPad: 3 }),
            frameRate: 10,
            repeat: -1
        });

        // Create the physics-based sprite that we will move around and animate
        this.sprite = scene.physics.add
            .sprite(x, y, "player", "ethan-front");

        this.sprite.body.collideWorldBounds = true;

        this.keys = scene.input.keyboard.createCursorKeys();
    }

    update() {
        const keys = this.keys;
        const sprite = this.sprite;
        const speed = 40;
        const prevVelocity = sprite.body.velocity.clone();

        // Stop any previous movement from the last frame
        sprite.setVelocity(0);

        // Horizontal movement
        if (keys.left.isDown) {
            sprite.setVelocityX(-speed);
        } else if (keys.right.isDown) {
            sprite.setVelocityX(speed);
        }

        // Vertical movement
        if (keys.up.isDown) {
            sprite.setVelocityY(-speed);
        } else if (keys.down.isDown) {
            sprite.setVelocityY(speed);
        }

        // Normalize and scale the velocity so that player can't move faster along a diagonal
        sprite.body.velocity.normalize().scale(speed);

        // Update the animation last and give left/right animations precedence over up/down animations
        if (keys.left.isDown) {
            sprite.anims.play("ethan-left-walk", true);
        } else if (keys.right.isDown) {
            sprite.anims.play("ethan-right-walk", true);
        } else if (keys.up.isDown) {
            sprite.anims.play("ethan-back-walk", true);
        } else if (keys.down.isDown) {
            sprite.anims.play("ethan-front-walk", true);
        } else {
            sprite.anims.stop();

            // If we were moving, pick and idle frame to use
            if (prevVelocity.x < 0) sprite.setTexture("player", "ethan-left");
            else if (prevVelocity.x > 0) sprite.setTexture("player", "ethan-right");
            else if (prevVelocity.y < 0) sprite.setTexture("player", "ethan-back");
            else if (prevVelocity.y > 0) sprite.setTexture("player", "ethan-front");
        }
    }
}