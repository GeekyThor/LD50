export class Bomb {
    constructor(scene, sprite, time_to_boom) {
        sprite.scale = 1.5;
        sprite.setBounce(0.3)
        sprite.setGravityY(100);
        scene.physics.add.collider(sprite, scene.ground)

        this.armed = true;
        this.boomed = false;

        scene.time.addEvent({
            callback: this.boom,
            callbackScope: this,
            delay: time_to_boom,
            loop: false
        });;
    }

    boom() {
        if (this.armed && !this.boomed) {
            console.log("boom");
            this.boomed = true;
        }
    }
}
