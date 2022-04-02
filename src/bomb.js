export class Bomb {
    constructor(scene, x, y, sprite_name, sprite_scale, time_to_boom) {
        var bomb = scene.add.image(0, 0, sprite_name);
        bomb.scale = sprite_scale;

        this.start_time = Date.now();
        this.time_to_boom = time_to_boom;
        this.timer_text = scene.add.text(-5, -4, String(Math.ceil(this.time_to_boom / 1000)));

        this.container = scene.add.container(x, y, [ bomb, this.timer_text ]);
        this.container.setSize(bomb.width, bomb.height);
        scene.physics.world.enable(this.container);

        this.container.body.setBounce(0.3);
        this.container.body.setGravityY(100);
        scene.physics.add.collider(this.container, scene.ground);

        this.armed = true;
        this.boomed = false;

        scene.time.addEvent({
            callback: this.boom,
            callbackScope: this,
            delay: time_to_boom,
            loop: false
        });;
    }

    update() { 
        if (this.armed && !this.boomed) {
            this.timer_text.text = String(Math.ceil((this.time_to_boom + this.start_time - Date.now()) / 1000));
        }
    }

    boom() {
        if (this.armed && !this.boomed) {
            console.log("boom");
            this.boomed = true;
        }
    }
}

export class SmallBomb extends Bomb {
    constructor(scene, x, y) {
        super(scene, x, y, 'small_bomb', 1, 5000);
    }
}
