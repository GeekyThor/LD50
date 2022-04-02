export class Bomb {
    constructor(scene, x, y, sprite_name, bomb_width, boom_radius, time_to_boom) {
        this.scene = scene;
        this.boom_radius = boom_radius;
        
        var bomb = scene.add.image(0, 0, sprite_name);
        bomb.scale = bomb_width / bomb.width;

        this.timer_time = time_to_boom;
        this.timer_text = scene.add.text(-5, -4, String(this.timer_time));

        this.container = scene.add.container(x, y, [ bomb, this.timer_text ]);
        this.container.setSize(bomb.width, bomb.height);
        scene.physics.world.enable(this.container);

        this.container.body.setBounce(0.3);
        this.container.body.setGravityY(300);
        this.container.body.setMaxVelocityY(300);
        this.container.body.collideWorldBounds = true;
        scene.physics.add.collider(this.container, scene.ground);

        this.armed = true;
        this.boomed = false;

        this.timer_event = scene.time.addEvent({
            callback: this.bomb_tick,
            callbackScope: this,
            delay: 1000,
            loop: true
        });
    }

    bomb_tick() { 
        if (this.armed && !this.boomed) {
            this.timer_time -= 1;
            if (this.timer_time == 0) {
                this.timer_event.loop = false;

                this.explosion = this.scene.add.circle(this.container.x, this.container.y, this.boom_radius, 0xff8800);
                this.scene.time.addEvent({
                    callback: this.remove_explosion,
                    callbackScope: this,
                    delay: 200,
                    loop: false
                });

                if (Phaser.Geom.Intersects.CircleToRectangle(
                    new Phaser.Geom.Circle(this.container.x, this.container.y, this.boom_radius),
                    this.scene.player.sprite.getBounds()
                )) {
                    this.scene.player.hit();
                }

                this.container.destroy();
                this.boomed = true;
            } else {
                this.timer_text.text = String(this.timer_time);
            }
        }
    }

    remove_explosion() {
        this.explosion.destroy();
    }

    update() {
        // Ground friction
        if (this.container.body != null) {
            if (Phaser.Geom.Intersects.RectangleToRectangle(
                this.container.getBounds(),
                this.scene.ground.getBounds()
            )) {
                if (Math.abs(this.container.body.velocity.x) < 100) {
                    this.container.body.setVelocityX(0);
                }
                this.container.body.setAccelerationX(-1000 * Math.sign(this.container.body.velocity.x)); 
            } else {
                this.container.body.setAccelerationX(0);
            }
        }
    }
}

export class SmallBomb extends Bomb {
    constructor(scene, x, y) {
        super(scene, x, y, 'small_bomb', 15, 25, 5);
    }
}
